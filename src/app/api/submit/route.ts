import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
const LANGUAGE_CONFIG = {
    javascript: {
        id: 63,
        timeout: 5000,
        memory: 128,
        compileTimeout: 10,
        extension: '.js'
    },
    python: {
        id: 71,
        timeout: 15000,
        memory: 256,
        compileTimeout: 10,
        extension: '.py'
    },
    java: {
        id: 62,
        timeout: 15000,
        memory: 512,
        compileTimeout: 30,
        extension: '.java'
    },
    cpp: {
        id: 54,
        timeout: 10000,
        memory: 256,
        compileTimeout: 30,
        extension: '.cpp'
    }
};

export async function POST(req: Request) {
    try {
        const { code: userCode, language, questionId } = await req.json();

        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true, driverCode: true },
        });

        if (!question || !question.driverCode) {
            return NextResponse.json({ error: 'Question or driver code not found.' }, { status: 404 });
        }

        const testCases = Array.isArray(question.testCases) ? question.testCases : [question.testCases];
        const lang = language.toLowerCase();
        
        const driverCodeTemplate = (question.driverCode as any)[lang];
        if (!driverCodeTemplate) {
            return NextResponse.json({ error: `Driver code for ${language} not found.` }, { status: 404 });
        }

        const fullCode = driverCodeTemplate.replace('// USER_CODE_PLACEHOLDER', userCode)
                                            .replace('# USER_CODE_PLACEHOLDER', userCode);
        
        console.log("Generated full code preview (first 500 chars):");
        console.log(fullCode.substring(0, 500));
        console.log("Generated full code length:", fullCode.length);
        
        //@ts-ignore
        const languageId = LANGUAGE_CONFIG[lang].id;
        
        // Create batch submissions for all test cases
        const submissions = testCases.map((testCase: any) => ({
            source_code: Buffer.from(fullCode).toString('base64'),
            language_id: languageId,
            stdin: Buffer.from(testCase.Input || '').toString('base64'),
            expected_output: Buffer.from(testCase.Output || '').toString('base64'),
        }));

        const judge0Headers = {
            'Content-Type': 'application/json',
            // Remove API key headers if using your own VM
            ...(process.env.JUDGE0_API_KEY && {
                'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                'X-RapidAPI-Host': process.env.JUDGE0_HOST || 'localhost'
            })
        };

        // Get Judge0 URL - hardcoded for now since we know it works
        const judge0Url = 'http://13.234.59.36:2358';
        
        if (!judge0Url) {
            console.error("Judge0 URL not found in environment variables");
            return NextResponse.json({ 
                error: 'Judge0 URL not configured. Please set JUDGE0_URL or NEXT_PUBLIC_JUDGE0_URL environment variable.' 
            }, { status: 500 });
        }

        console.log("Using Judge0 URL:", judge0Url);
        console.log("Language ID:", languageId);
        console.log("Number of test cases:", testCases.length);
        //@ts-ignore
        console.log("First test case input:", testCases[0]?.Input);
         //@ts-ignore
        console.log("First test case expected output:", testCases[0]?.Output);
        
        // Test Judge0 connectivity first
        try {
            const testResponse = await fetch(`${judge0Url}/system_info`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!testResponse.ok) {
                console.error("Judge0 system_info failed:", testResponse.status);
            } else {
                console.log("Judge0 connectivity: OK");
            }
        } catch (connectError) {
            console.error("Judge0 connectivity error:", connectError);
        }

        // Try batch submission first, fallback to individual if it fails
        let processedResults;
        
        try {
            // Submit batch request
            const batchResponse = await fetch(
                `${judge0Url}/submissions/batch?base64_encoded=true&fields=*`,
                {
                    method: 'POST',
                    headers: judge0Headers,
                    body: JSON.stringify({
                        submissions: submissions
                    }),
                }
            );

            if (!batchResponse.ok) {
                const errorText = await batchResponse.text();
                console.error(`Batch submission failed with status: ${batchResponse.status}`, errorText);
                throw new Error(`Batch submission failed with status: ${batchResponse.status}`);
            }
            
            const batchResults = await batchResponse.json();
            console.log("Batch submission results:", JSON.stringify(batchResults, null, 2));

            // Check if we got tokens or direct results
            let finalResults = batchResults;
            
            if (Array.isArray(batchResults) && batchResults[0]?.token) {
                console.log("Got tokens, polling for results...");
                finalResults = await Promise.all(
                    batchResults.map(async (result: any) => {
                        if (result.token) {
                            return await pollForResult(judge0Url, result.token, judge0Headers);
                        }
                        return result;
                    })
                );
            }

            // Process all results
            processedResults = finalResults.map((result: any, index: number) => {
                // Decode base64 outputs
                if (result.stdout) result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
                if (result.stderr) result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
                if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');

                return processSubmissionResult(result, testCases[index], index + 1);
            });
            
        } catch (batchError) {
             //@ts-ignore
            console.log("Batch submission failed, falling back to individual submissions:", batchError.message);
            
            // Fallback to individual submissions
            processedResults = await submitIndividualTestCases(testCases, fullCode, languageId, judge0Headers, judge0Url);
        }

        // Calculate overall result
         //@ts-ignore
        const passedTests = processedResults.filter(r => r.passed).length;
        const totalTests = testCases.length;
        const allPassed = passedTests === totalTests;

        return NextResponse.json({
            overallStatus: allPassed ? 'Accepted' : 'Failed',
            passedTests,
            totalTests,
            results: processedResults,
             //@ts-ignore
            details: processedResults.map(r => ({
                testCase: r.testCase,
                status: r.status,
                passed: r.passed,
                actualOutput: r.actualOutput,
                expectedOutput: r.expectedOutput,
                error: r.error
            }))
        });

    } catch (error) {
        console.error("Top-level submission error:", error);
        return NextResponse.json({ 
            error: 'Server error processing your request.',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function processSubmissionResult(result: any, testCase: any, testCaseNumber: number) {
    console.log(`Raw result for test case ${testCaseNumber}:`, JSON.stringify(result, null, 2));
    
    const { status, stdout, stderr, compile_output, time, memory } = result;

    console.log(`--- TEST CASE ${testCaseNumber} ---`);
    console.log(`Status: ${status?.description || 'Unknown'} (ID: ${status?.id || 'Unknown'})`);
    
    // Handle case where status might be directly in result
    const statusId = status?.id || result.id;
    const statusDescription = status?.description || result.description;
    
    if (statusId === 3) { // Accepted
        const actualOutput = (stdout || '').trim();
        const expectedOutput = (testCase.Output || '').trim();
        
        // For exact comparison, you might want to normalize whitespace
        const normalizedActual = actualOutput.replace(/\s+/g, ' ').trim();
        const normalizedExpected = expectedOutput.replace(/\s+/g, ' ').trim();
        
        console.log(`Actual Output: >${actualOutput}<`);
        console.log(`Expected Output: >${expectedOutput}<`);
        console.log(`Normalized Match: ${normalizedActual === normalizedExpected}`);
        console.log(`--- END TEST CASE ${testCaseNumber} ---`);

        const passed = normalizedActual === normalizedExpected;
        
        return {
            testCase: testCaseNumber,
            status: passed ? 'Accepted' : 'Wrong Answer',
            passed,
            actualOutput,
            expectedOutput,
            executionTime: time,
            memoryUsed: memory,
            error: null
        };
    } else {
        // Handle compilation errors, runtime errors, etc.
        console.log(`Error Details:`, { stderr, compile_output });
        console.log(`--- END TEST CASE ${testCaseNumber} ---`);
        
        return {
            testCase: testCaseNumber,
            status: status?.description || 'Unknown Error',
            passed: false,
            actualOutput: stdout || '',
            expectedOutput: testCase.Output || '',
            executionTime: time,
            memoryUsed: memory,
            error: {
                stderr: stderr || null,
                compile_output: compile_output || null
            }
        };
    }
}

// Alternative function for individual submission approach (if batch doesn't work)
async function submitIndividualTestCases(testCases: any[], fullCode: string, languageId: number, judge0Headers: any, judge0Url: string) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        try {
            console.log(`Submitting test case ${i + 1}...`);
            
            const submissionPayload = {
                source_code: Buffer.from(fullCode).toString('base64'),
                language_id: languageId,
                stdin: Buffer.from(testCase.Input || '').toString('base64'),
            };
            
            console.log(`Payload for test case ${i + 1}:`, {
                source_code_length: submissionPayload.source_code.length,
                language_id: submissionPayload.language_id,
                stdin_length: submissionPayload.stdin.length
            });
            
            const submissionResponse = await fetch(
                `${judge0Url}/submissions?base64_encoded=true&fields=*`,
                {
                    method: 'POST',
                    headers: judge0Headers,
                    body: JSON.stringify(submissionPayload),
                }
            );

            if (!submissionResponse.ok) {
                const errorText = await submissionResponse.text();
                console.error(`Test case ${i + 1} failed with status: ${submissionResponse.status}`, errorText);
                throw new Error(`Failed to submit test case ${i + 1}: ${submissionResponse.status} ${errorText}`);
            }

            const submissionResult = await submissionResponse.json();
            console.log(`Submission result for test case ${i + 1}:`, submissionResult);
            
            let result;
            
            if (submissionResult.token) {
                // Need to poll for results using token
                console.log(`Polling for results of test case ${i + 1} with token: ${submissionResult.token}`);
                result = await pollForResult(judge0Url, submissionResult.token, judge0Headers);
            } else {
                // Direct result (wait=true worked)
                result = submissionResult;
            }
            
            console.log(`Final result for test case ${i + 1}:`, JSON.stringify(result, null, 2));
            
            // Decode outputs
            if (result.stdout) result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
            if (result.stderr) result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
            if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');

            results.push(processSubmissionResult(result, testCase, i + 1));
            
            // Small delay between requests to avoid overwhelming your VM
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`Error submitting test case ${i + 1}:`, error);
            results.push({
                testCase: i + 1,
                status: 'Submission Error',
                passed: false,
                actualOutput: '',
                expectedOutput: testCase.Output || '',
                executionTime: null,
                memoryUsed: null,
                error: { message: error instanceof Error ? error.message : 'Unknown error' }
            });
        }
    }
    
    return results;
}

// Function to poll Judge0 for results using token
async function pollForResult(judge0Url: string, token: string, headers: any, maxAttempts: number = 10): Promise<any> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`Polling attempt ${attempt} for token ${token}`);
            
            const response = await fetch(`${judge0Url}/submissions/${token}?base64_encoded=true&fields=*`, {
                method: 'GET',
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`Polling failed with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log(`Polling result for ${token}:`, JSON.stringify(result, null, 2));
            
            // Check if processing is complete
            if (result.status && result.status.id !== 1 && result.status.id !== 2) {
                // Status 1 = In Queue, Status 2 = Processing
                // Any other status means it's done
                return result;
            }
            
            // Wait before next attempt
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            
        } catch (error) {
            console.error(`Polling attempt ${attempt} failed:`, error);
            if (attempt === maxAttempts) {
                throw error;
            }
        }
    }
    
    throw new Error(`Polling timeout after ${maxAttempts} attempts for token ${token}`);
}