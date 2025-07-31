import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Enhanced language configuration with debug settings
const LANGUAGE_CONFIG = {
    javascript: {
        id: 93,
        timeout: 5000,
        memory: 128,
        compileTimeout: 10,
        extension: '.js'
    },
    python: {
        id: 71,
        timeout: 15000,  // Increased for Python
        memory: 256,
        compileTimeout: 10,
        extension: '.py'
    },
    java: {
        id: 62,
        timeout: 15000,
        memory: 512,
        compileTimeout: 30,  // Java needs more compile time
        extension: '.java'
    },
    cpp: {
        id: 54,
        timeout: 10000,  // Increased for C++
        memory: 256,
        compileTimeout: 30,  // C++ needs more compile time
        extension: '.cpp'
    }
};

export async function POST(req: Request) {
    try {
        const { code: userCode, language, questionId } = await req.json();

        // Database se ab 'driverCode' fetch karein
        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true, driverCode: true },
        });

        if (!question || !question.driverCode) {
            return NextResponse.json({ error: 'Question or driver code not found.' }, { status: 404 });
        }

        const testCases = Array.isArray(question.testCases) ? question.testCases : [question.testCases];
        // We are running only the first test case for now
        const testCase = testCases[0] as any;
        
        const lang = language.toLowerCase();
        
        const driverCodeTemplate = (question.driverCode as any)[lang];
        if (!driverCodeTemplate) {
            return NextResponse.json({ error: `Driver code for ${language} not found.` }, { status: 404 });
        }

        const fullCode = driverCodeTemplate.replace('// USER_CODE_PLACEHOLDER', userCode)
                                            .replace('# USER_CODE_PLACEHOLDER', userCode);
        //@ts-ignore
        const languageId = LANGUAGE_CONFIG[lang].id;
        
        const judge0Headers = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        };

        const submissionResponse = await fetch(
            `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions?base64_encoded=true&wait=true&fields=*`,
            {
                method: 'POST',
                headers: judge0Headers,
                body: JSON.stringify({
                    source_code: Buffer.from(fullCode).toString('base64'),
                    language_id: languageId,
                    stdin: Buffer.from(testCase.Input).toString('base64'),
                }),
            }
        );

        if (!submissionResponse.ok) {
            const errorData = await submissionResponse.json();
            return NextResponse.json({ error: 'Failed to create submission on Judge0.', details: errorData }, { status: 500 });
        }
        
        const finalResult = await submissionResponse.json();

        if (finalResult.stdout) finalResult.stdout = Buffer.from(finalResult.stdout, 'base64').toString('utf-8');
        if (finalResult.stderr) finalResult.stderr = Buffer.from(finalResult.stderr, 'base64').toString('utf-8');
        if (finalResult.compile_output) finalResult.compile_output = Buffer.from(finalResult.compile_output, 'base64').toString('utf-8');

        return processSubmissionResult(finalResult, testCase);

    } catch (error) {
        console.error("Top-level submission error:", error);
        return NextResponse.json({ error: 'Server error processing your request.' }, { status: 500 });
    }
}

function processSubmissionResult(result: any, testCase: any) {
    const { status, stdout, stderr, compile_output } = result;

    if (status.id === 3) { // Accepted
        const actualOutput = (stdout || '').trim().replace(/\s/g, '');
        const expectedOutput = (testCase.Output || '').trim().replace(/\s/g, '');
        
        // --- DEBUG LOGS ADDED HERE ---
        console.log(`--- COMPARING OUTPUTS ---`);
        console.log(`Actual Output (stdout)  : >${actualOutput}<`);
        console.log(`Expected Output (from DB): >${expectedOutput}<`);
        console.log(`Match: ${actualOutput === expectedOutput}`);
        console.log(`--- END COMPARISON ---`);
        // --- END OF DEBUG LOGS ---

        if (actualOutput === expectedOutput) {
            return NextResponse.json({ status: { description: 'Accepted' } });
        } else {
            return NextResponse.json({ status: { description: 'Wrong Answer' } });
        }
    } else {
        return NextResponse.json({ 
            status: { description: status.description },
            details: { stderr, compile_output }
        });
    }
}
