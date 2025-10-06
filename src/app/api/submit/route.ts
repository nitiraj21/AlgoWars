import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { redisClient } from '@/src/lib/redis';

const LANGUAGE_CONFIG = {
    javascript: {
        id: 63,
        timeout: 5000,
        memory: 128,
        compileTimeout: 10,
        extension: '.js',
        pollInterval: 500 // ms
    },
    python: {
        id: 71,
        timeout: 15000,
        memory: 256,
        compileTimeout: 10,
        extension: '.py',
        pollInterval: 800 // ms
    },
    java: {
        id: 62,
        timeout: 15000,
        memory: 512,
        compileTimeout: 30,
        extension: '.java',
        pollInterval: 1500 // ms - longer for Java due to compilation
    },
    cpp: {
        id: 54,
        timeout: 10000,
        memory: 256,
        compileTimeout: 30,
        extension: '.cpp',
        pollInterval: 1000 // ms
    }
} as const;

type Language = keyof typeof LANGUAGE_CONFIG;

interface TestCase {
    Input: string;
    Output: string;
}

interface SubmissionResult {
    testCase: number;
    status: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime?: number | null;
    memoryUsed?: number | null;
    error?: {
        stderr?: string | null;
        compile_output?: string | null;
        message?: string;
    } | null;
    compile_output?: string | null;
    stderr?: string | null;
}

// Create a fetch function with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 30000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

export async function POST(req: Request) {
    try {
        // Authentication and rate limiting
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateLimitResult = await checkRateLimit(session.user.email);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a minute" }, 
                { status: 429 }
            );
        }

        const { code: userCode, language, questionId } = await req.json();
        
        // Validate inputs
        if (!userCode || !language || !questionId) {
            return NextResponse.json(
                { error: "Missing required fields: code, language, or questionId" }, 
                { status: 400 }
            );
        }

        const lang = language.toLowerCase() as Language;
        if (!(lang in LANGUAGE_CONFIG)) {
            return NextResponse.json(
                { error: `Unsupported language: ${language}` }, 
                { status: 400 }
            );
        }

        // Fetch question data
        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true, driverCode: true },
        });

        if (!question?.driverCode) {
            return NextResponse.json(
                { error: 'Question or driver code not found.' }, 
                { status: 404 }
            );
        }

        const testCases = Array.isArray(question.testCases) 
            ? question.testCases as unknown as TestCase[]
            : [question.testCases] as unknown as TestCase[];
        
        const driverCodeTemplate = (question.driverCode as any)[lang];
        if (!driverCodeTemplate) {
            return NextResponse.json(
                { error: `Driver code for ${language} not found.` }, 
                { status: 404 }
            );
        }

        // Generate full code more efficiently
        const fullCode = driverCodeTemplate
            .replace('// USER_CODE_PLACEHOLDER', userCode)
            .replace('# USER_CODE_PLACEHOLDER', userCode);
        
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
            console.log("Generated full code preview (first 200 chars):", fullCode.substring(0, 200));
            console.log("Language:", lang, "Test cases:", testCases.length);
        }

        const results = await executeTestCases(fullCode, lang, testCases);
        
        const passedTests = results.filter(r => r.passed).length;
        const totalTests = testCases.length;
        const allPassed = passedTests === totalTests;

        return NextResponse.json({
            overallStatus: allPassed ? 'Accepted' : 'Failed',
            passedTests,
            totalTests,
            compile_output: results[0]?.compile_output || null,
            stderr: results[0]?.stderr || null,
            results,
            testCases,
            details: results.map(r => ({
                testCase: r.testCase,
                status: r.status,
                passed: r.passed,
                actualOutput: r.actualOutput,
                expectedOutput: r.expectedOutput,
                error: r.error,
                compile_output: r.compile_output,
                stderr: r.stderr
            }))
        });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ 
            error: 'Server error processing your request.',
            details: process.env.NODE_ENV === 'development' 
                ? (error instanceof Error ? error.message : 'Unknown error')
                : undefined
        }, { status: 500 });
    }
}

async function checkRateLimit(email: string): Promise<{ allowed: boolean }> {
    const limit = 10;
    const windowInSeconds = 60;
    const key = `rate-limit:submit:${email}`;
    const now = Date.now();

    const transaction = redisClient.multi();
    transaction.zRemRangeByScore(key, 0, now - (windowInSeconds * 1000));
    transaction.zAdd(key, { score: now, value: now.toString() });
    transaction.zCard(key);
    transaction.expire(key, windowInSeconds);

    const results = await transaction.exec();
    const reqCount = results[2] as unknown as number;
    
    return { allowed: reqCount <= limit };
}

async function executeTestCases(fullCode: string, lang: Language, testCases: TestCase[]): Promise<SubmissionResult[]> {
    const judge0Url = process.env.JUDGE0_URL || 'http://13.201.45.209';
    const languageConfig = LANGUAGE_CONFIG[lang];
    
    const judge0Headers = {
        'Content-Type': 'application/json',
        ...(process.env.JUDGE0_API_KEY && {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': process.env.JUDGE0_HOST || 'localhost'
        })
    };

    // Pre-encode the source code once
    const encodedSourceCode = Buffer.from(fullCode).toString('base64');

    try {
        // Try batch submission first
        return await batchSubmission(judge0Url, judge0Headers, encodedSourceCode, languageConfig, testCases);
    } catch (batchError) {
        console.warn("Batch submission failed, using individual submissions:", (batchError as Error).message);
        // Fallback to optimized individual submissions
        return await individualSubmissions(judge0Url, judge0Headers, encodedSourceCode, languageConfig, testCases);
    }
}

async function batchSubmission(
    judge0Url: string, 
    headers: any, 
    encodedSourceCode: string, 
    languageConfig: typeof LANGUAGE_CONFIG[Language], 
    testCases: TestCase[]
): Promise<SubmissionResult[]> {
    
    const submissions = testCases.map(testCase => ({
        source_code: encodedSourceCode,
        language_id: languageConfig.id,
        stdin: Buffer.from(testCase.Input || '').toString('base64'),
        expected_output: Buffer.from(testCase.Output || '').toString('base64'),
    }));

    const response = await fetchWithTimeout(
        `${judge0Url}/submissions/batch?base64_encoded=true&fields=*`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({ submissions }),
        },
        45000 // 45s timeout for batch
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Batch submission failed: ${response.status} ${errorText}`);
    }
    
    const batchResults = await response.json();
    
    let finalResults = batchResults;
    
    // Handle token-based results
    if (Array.isArray(batchResults) && batchResults[0]?.token) {
        finalResults = await Promise.all(
            batchResults.map(async (result: any) => {
                if (result.token) {
                    return await pollForResult(judge0Url, result.token, headers, languageConfig.pollInterval);
                }
                return result;
            })
        );
    }

    return finalResults.map((result: any, index: number) => {
        decodeResult(result);
        return processSubmissionResult(result, testCases[index], index + 1);
    });
}

async function individualSubmissions(
    judge0Url: string, 
    headers: any, 
    encodedSourceCode: string, 
    languageConfig: typeof LANGUAGE_CONFIG[Language], 
    testCases: TestCase[]
): Promise<SubmissionResult[]> {
    
    // Use Promise.all with concurrency limit instead of sequential processing
    const concurrencyLimit = 3; // Adjust based on your Judge0 server capacity
    const results: SubmissionResult[] = [];
    
    for (let i = 0; i < testCases.length; i += concurrencyLimit) {
        const batch = testCases.slice(i, i + concurrencyLimit);
        const batchPromises = batch.map(async (testCase, batchIndex) => {
            const actualIndex = i + batchIndex;
            return await submitSingleTestCase(
                judge0Url, 
                headers, 
                encodedSourceCode, 
                languageConfig, 
                testCase, 
                actualIndex + 1
            );
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }
    
    return results;
}

async function submitSingleTestCase(
    judge0Url: string,
    headers: any,
    encodedSourceCode: string,
    languageConfig: typeof LANGUAGE_CONFIG[Language],
    testCase: TestCase,
    testCaseNumber: number
): Promise<SubmissionResult> {
    
    try {
        const submissionPayload = {
            source_code: encodedSourceCode,
            language_id: languageConfig.id,
            stdin: Buffer.from(testCase.Input || '').toString('base64'),
        };
        
        const response = await fetchWithTimeout(
            `${judge0Url}/submissions?base64_encoded=true&fields=*`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify(submissionPayload),
            },
            30000 // 30s timeout
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Submit failed: ${response.status} ${errorText}`);
        }

        const submissionResult = await response.json();
        
        let result;
        if (submissionResult.token) {
            result = await pollForResult(judge0Url, submissionResult.token, headers, languageConfig.pollInterval);
        } else {
            result = submissionResult;
        }
        
        decodeResult(result);
        return processSubmissionResult(result, testCase, testCaseNumber);
        
    } catch (error) {
        console.error(`Error in test case ${testCaseNumber}:`, error);
        return {
            testCase: testCaseNumber,
            status: 'Submission Error',
            passed: false,
            actualOutput: '',
            expectedOutput: testCase.Output || '',
            executionTime: null,
            memoryUsed: null,
            error: { 
                message: error instanceof Error ? error.message : 'Unknown submission error' 
            }
        };
    }
}

async function pollForResult(
    judge0Url: string, 
    token: string, 
    headers: any, 
    pollInterval: number = 1000,
    maxAttempts: number = 30
): Promise<any> {
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetchWithTimeout(
                `${judge0Url}/submissions/${token}?base64_encoded=true&fields=*`,
                { method: 'GET', headers },
                10000 // 10s timeout per poll
            );
            
            if (!response.ok) {
                throw new Error(`Poll failed: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Check if processing is complete (not in queue or processing)
            const statusId = result.status?.id || result.id;
            if (statusId && statusId !== 1 && statusId !== 2) {
                return result;
            }
            
            // Dynamic wait time based on language and attempt
            const waitTime = Math.min(pollInterval * attempt, 3000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
        } catch (error) {
            if (attempt === maxAttempts) {
                throw new Error(`Polling timeout after ${maxAttempts} attempts: ${(error as Error).message}`);
            }
            // Exponential backoff on errors
            await new Promise(resolve => setTimeout(resolve, pollInterval * attempt));
        }
    }
    
    throw new Error(`Polling timeout for token ${token}`);
}

function decodeResult(result: any): void {
    if (result.stdout) {
        result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
    }
    if (result.stderr) {
        result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
    }
    if (result.compile_output) {
        result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');
    }
}

function processSubmissionResult(result: any, testCase: TestCase, testCaseNumber: number): SubmissionResult {
    const { status, stdout, stderr, compile_output, time, memory } = result;
    
    const statusId = status?.id || result.id;
    const statusDescription = status?.description || result.description || 'Unknown';
    
    if (statusId === 3) { // Accepted
        const actualOutput = (stdout || '').trim();
        const expectedOutput = (testCase.Output || '').trim();
        
        // More efficient string comparison
        const passed = actualOutput === expectedOutput || 
                      actualOutput.replace(/\s+/g, ' ') === expectedOutput.replace(/\s+/g, ' ');
        
        return {
            testCase: testCaseNumber,
            status: passed ? 'Accepted' : 'Wrong Answer',
            passed,
            actualOutput,
            expectedOutput,
            executionTime: time,
            memoryUsed: memory,
            error: null,
            compile_output: compile_output || null,
            stderr: stderr || null
        };
    } else {
        // Handle errors
        return {
            testCase: testCaseNumber,
            status: statusDescription,
            passed: false,
            actualOutput: stdout || '',
            expectedOutput: testCase.Output || '',
            executionTime: time,
            memoryUsed: memory,
            error: {
                stderr: stderr || null,
                compile_output: compile_output || null
            },
            compile_output: compile_output || null,
            stderr: stderr || null
        };
    }
}