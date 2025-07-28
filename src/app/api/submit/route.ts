
import { prisma } from '@/src/lib/prisma'
import { NextResponse } from 'next/server';

const getLanguageId = (language: string): number => {
    if (language === 'javascript') return 93;
    if (language === 'python') return 71;
    return 93;
};

const getDriverCode = (language: string, functionName: string) => {
    if (language === 'javascript') {
        return `
            try {
                const fs = require('fs');
                const input = fs.readFileSync(0, 'utf-8');
                const correctedInput = input.replace(/\\\\n/g, '\\n');
                const lines = correctedInput.trim().split('\\n');
                const nums = JSON.parse(lines[0]);
                const target = parseInt(lines[1], 10);
                // Yahan dynamic function name ka istemaal ho raha hai
                const result = ${functionName}(nums, target);
                console.log(JSON.stringify(result));
            } catch (e) {
                console.log("CAUGHT_ERROR: " + e.message);
            }
        `;
    }
    return '';
};

export async function POST(req: Request) {
    try {
        const { code: userCode, language, questionId } = await req.json();

        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true, functionName: true },
        });

        if (!question || !question.testCases || !question.functionName) {
            return NextResponse.json({ error: 'Question, test cases, or function name not found.' }, { status: 404 });
        }

        const testCases = Array.isArray(question.testCases) ? question.testCases : [question.testCases];
        const testCase = testCases[0] as any;
        

const getLanguageId = (language: string): number => {
    if (language === 'javascript') return 93;
    if (language === 'python') return 71;
    return 93;
};

const getDriverCode = (language: string, functionName: string = 'twoSum2') => {
    if (language === 'javascript') {
        return `
            try {
                const fs = require('fs');
                const input = fs.readFileSync(0, 'utf-8');
                const correctedInput = input.replace(/\\\\n/g, '\\n');
                const lines = correctedInput.trim().split('\\n');
                const nums = JSON.parse(lines[0]);
                const target = parseInt(lines[1], 10);
                const result = ${functionName}(nums, target);
                console.log(JSON.stringify(result)); 
            } catch (e) {
                console.log("CAUGHT_ERROR: " + e.message);
            }
        `;
    }
    return '';
};

 async function POST(req: Request) {
    try {
        const { code: userCode, language, questionId } = await req.json();

        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true },
        });

        if (!question || !question.testCases) {
            return NextResponse.json({ error: 'Question or test cases not found.' }, { status: 404 });
        }

        const testCases = Array.isArray(question.testCases) ? question.testCases : [question.testCases];
        const testCase = testCases[0] as any;
        
        const driverCode = getDriverCode(language);
        const fullCode = userCode + driverCode;
        const languageId = getLanguageId(language);

        const judge0Headers = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        };

        const submissionResponse = await fetch(
            `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
            {
                method: 'POST',
                headers: judge0Headers,
                body: JSON.stringify({
                    source_code: fullCode,
                    language_id: languageId,
                    stdin: testCase.Input,
                }),
            }
        );

        if (!submissionResponse.ok) {
            const errorData = await submissionResponse.json();
            console.error("Judge0 submission creation failed:", errorData);
            return NextResponse.json({ error: 'Failed to create submission on Judge0.' }, { status: 500 });
        }

        const submissionData = await submissionResponse.json();
        const token = submissionData.token;
        let finalResult: any = null;

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await fetch(
                `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                { headers: judge0Headers }
            );
            if (!resultResponse.ok) {
                return NextResponse.json({ error: 'Failed to retrieve submission result.' }, { status: 500 });
            }
            const resultData = await resultResponse.json();
            if (resultData && resultData.status && resultData.status.id > 2) {
                finalResult = resultData;
                break;
            }
        }

        if (finalResult.status.id === 3) {
            const actualOutput = finalResult.stdout ? finalResult.stdout.trim() : '';
            const expectedOutput = testCase.Output;

            // --- IMPORTANT DEBUG LOG ---
            console.log(`--- COMPARING ---`);
            console.log(`Actual Output  : >${actualOutput}< (Type: ${typeof actualOutput})`);
            console.log(`Expected Output: >${expectedOutput}< (Type: ${typeof expectedOutput})`);
            console.log(`--- END COMPARE ---`);

            if (actualOutput === expectedOutput) {
                return NextResponse.json({ status: { description: 'Accepted' } });
            } else {
                return NextResponse.json({ status: { description: 'Wrong Answer' } });
            }
        } else {
            return NextResponse.json({ status: { description: finalResult.status.description } });
        }

    } catch (error) {
        console.error("Top-level submission error:", error);
        return NextResponse.json({ error: 'Server error processing your request.' }, { status: 500 });
    }
}
        const driverCode = getDriverCode(language, question.functionName);
        const fullCode = userCode + driverCode;
        const languageId = getLanguageId(language);

        const judge0Headers = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        };

        const submissionResponse = await fetch(
            `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
            {
                method: 'POST',
                headers: judge0Headers,
                body: JSON.stringify({
                    source_code: fullCode,
                    language_id: languageId,
                    stdin: testCase.Input,
                }),
            }
        );

        if (!submissionResponse.ok) {
            const errorData = await submissionResponse.json();
            console.error("Judge0 submission creation failed:", errorData);
            return NextResponse.json({ error: 'Failed to create submission on Judge0.' }, { status: 500 });
        }
        
        const submissionData = await submissionResponse.json();
        const token = submissionData.token;
        let finalResult: any = null;

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await fetch(
                `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                { headers: judge0Headers }
            );
            if (!resultResponse.ok) {
                return NextResponse.json({ error: 'Failed to retrieve submission result.' }, { status: 500 });
            }
            const resultData = await resultResponse.json();
            if (resultData && resultData.status && resultData.status.id > 2) {
                finalResult = resultData;
                break;
            }
        }

        if (finalResult.status.id === 3) {
            const actualOutput = finalResult.stdout ? finalResult.stdout.trim() : '';
            if (actualOutput === testCase.Output) {
                return NextResponse.json({ status: { description: 'Accepted' } });
            } else {
                return NextResponse.json({ status: { description: 'Wrong Answer' } });
            }
        } else {
            return NextResponse.json({ status: { description: finalResult.status.description } });
        }

    } catch (error) {
        console.error("Top-level submission error:", error);
        return NextResponse.json({ error: 'Server error processing your request.' }, { status: 500 });
    }
}
