import { NextResponse } from 'next/server';
import {prisma} from '@/src/lib/prisma';

const getLanguageId = (language: string): number => {
    switch (language.toLowerCase()) {
        case 'javascript': return 93;
        case 'python': return 71;
        case 'java': return 62;
        case 'cpp': return 54;
        default: return 93;
    }
};

// --- FIXED MULTI-LANGUAGE DRIVER CODE GENERATOR ---
const getDriverCode = (language: string, functionName: string, inputSignature: any[]) => {
    const paramsList = inputSignature.map(p => p.name).join(', ');

    switch (language.toLowerCase()) {
        case 'javascript': {
            const parsingLogic = inputSignature.map((param, index) => {
                if (param.type.includes('[]')) return `const ${param.name} = JSON.parse(lines[${index}]);`;
                if (param.type === 'integer') return `const ${param.name} = parseInt(lines[${index}], 10);`;
                if (param.type === 'string') return `const ${param.name} = lines.join('\\n').trim();`;
                return '';
            }).join('\n                ');

            return `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8');
    const correctedInput = input.replace(/\\\\n/g, '\\n');
    const lines = correctedInput.trim().split('\\n');
    ${parsingLogic}
    
    let result;
    // Try to instantiate Solution class, otherwise call function directly
    try {
        const solution = new Solution();
        result = solution.${functionName}(${paramsList});
    } catch (e) {
        // If Solution class doesn't exist, try calling function directly
        result = ${functionName}(${paramsList});
    }
    
    // Don't automatically sort - let the algorithm determine the order
    if (typeof result === 'object') {
        console.log(JSON.stringify(result));
    } else {
        console.log(result);
    }
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}
            `;
        }
        
        case 'python': {
            const parsingLogic = inputSignature.map((param, index) => {
                if (param.type.includes('[]')) return `    ${param.name} = json.loads(lines[${index}])`;
                if (param.type === 'integer') return `    ${param.name} = int(lines[${index}])`;
                if (param.type === 'string') return `    ${param.name} = "\\n".join(lines).strip()`;
                return '';
            }).join('\n');

            return `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    input_data = sys.stdin.read()
    lines = input_data.strip().split('\\n')
${parsingLogic}
    
    # Try to find Solution class, otherwise try standalone function
    try:
        solver = Solution()
        result = solver.${functionName}(${paramsList})
    except NameError:
        # If Solution class doesn't exist, try calling function directly
        result = ${functionName}(${paramsList})
    
    # Don't automatically sort - let the algorithm determine the order
    if isinstance(result, (list, dict)):
        print(json.dumps(result))
    else:
        print(result)
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")
            `;
        }

        case 'java': {
            const parsingLogic = inputSignature.map((param, index) => {
                if (param.type === 'integer[]') {
                    return `        String[] ${param.name}Str = lines.get(${index}).replace("[", "").replace("]", "").split(",");
        int[] ${param.name} = new int[${param.name}Str.length];
        for(int i = 0; i < ${param.name}Str.length; i++) {
            ${param.name}[i] = Integer.parseInt(${param.name}Str[i].trim());
        }`;
                }
                if (param.type === 'integer') {
                    return `        int ${param.name} = Integer.parseInt(lines.get(${index}).trim());`;
                }
                if (param.type === 'string') {
                    return `        String ${param.name} = String.join("\\n", lines).trim();`;
                }
                return '';
            }).join("\n");

            return `
import java.util.*;
import java.io.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            List<String> lines = new ArrayList<>();
            while(scanner.hasNextLine()){
                lines.add(scanner.nextLine());
            }
            scanner.close();

${parsingLogic}
            
            Solution sol = new Solution();
            Object result = sol.${functionName}(${paramsList});
            
            if (result instanceof int[]) {
                int[] arr = (int[]) result;
                // Don't sort automatically - preserve algorithm's order
                System.out.print("[");
                for (int i = 0; i < arr.length; i++) {
                    System.out.print(arr[i]);
                    if (i < arr.length - 1) System.out.print(",");
                }
                System.out.println("]");
            } else if (result instanceof List) {
                List<?> list = (List<?>) result;
                System.out.print("[");
                for (int i = 0; i < list.size(); i++) {
                    System.out.print(list.get(i));
                    if (i < list.size() - 1) System.out.print(",");
                }
                System.out.println("]");
            } else {
                System.out.println(result);
            }
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}
            `;
        }

        case 'cpp': {
            const parsingLogic = inputSignature.map((param, index) => {
                if (param.type.includes('[]') || param.type === 'integer[]') {
                    return `    // Parse array from input
    std::string ${param.name}_line = lines[${index}];
    // Remove brackets
    if (${param.name}_line.front() == '[' && ${param.name}_line.back() == ']') {
        ${param.name}_line = ${param.name}_line.substr(1, ${param.name}_line.length() - 2);
    }
    std::vector<int> ${param.name};
    if (!${param.name}_line.empty()) {
        std::stringstream ${param.name}_ss(${param.name}_line);
        std::string ${param.name}_item;
        while (std::getline(${param.name}_ss, ${param.name}_item, ',')) {
            // Remove leading/trailing whitespace
            size_t start = ${param.name}_item.find_first_not_of(" \\t");
            if (start != std::string::npos) {
                size_t end = ${param.name}_item.find_last_not_of(" \\t");
                ${param.name}_item = ${param.name}_item.substr(start, end - start + 1);
                ${param.name}.push_back(std::stoi(${param.name}_item));
            }
        }
    }`;
                }
                if (param.type === 'integer') {
                    return `    int ${param.name} = std::stoi(lines[${index}]);`;
                }
                if (param.type === 'string') {
                    return `    std::string ${param.name} = lines[0];`;
                }
                return '';
            }).join("\n");

            return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <unordered_map>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::vector<std::string> lines;
        std::string line;
        while (std::getline(std::cin, line)) {
            lines.push_back(line);
        }
        
        if (lines.empty()) {
            std::cout << "CAUGHT_ERROR: No input received" << std::endl;
            return 1;
        }
        
${parsingLogic}

        Solution sol;
        std::vector<int> result = sol.${functionName}(${paramsList});
        
        // Output result in JSON-like format to match expected output
        std::cout << "[";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << result[i];
            if (i != result.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;
        
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
            `;
        }

        default:
            return '';
    }
};

export async function POST(req: Request) {
    try {
        const { code: userCode, language, questionId } = await req.json();

        const question = await prisma.problem.findUnique({
            where: { id: questionId },
            select: { testCases: true, functionName: true, inputSignature: true },
        });

        if (!question || !question.testCases || !question.functionName || !question.inputSignature) {
            return NextResponse.json({ error: 'Question data is incomplete.' }, { status: 404 });
        }

        const testCases = Array.isArray(question.testCases) ? question.testCases : [question.testCases];
        const testCase = testCases[0] as any;
        
        const driverCode = getDriverCode(language, question.functionName, question.inputSignature as any[]);
        
        const fullCode = driverCode.replace('// USER_CODE_PLACEHOLDER', userCode);
        
        const languageId = getLanguageId(language);
        
        const judge0Headers = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        };

        // Create submission
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
        let attempts = 0;
        const maxAttempts = 30; // Maximum 30 seconds wait

        // Poll for results with timeout
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                const resultResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                    { 
                        headers: judge0Headers,
                        method: 'GET'
                    }
                );
                
                if (!resultResponse.ok) {
                    console.error(`Failed to retrieve submission result. Status: ${resultResponse.status}`);
                    attempts++;
                    continue;
                }
                
                const resultData = await resultResponse.json();
                console.log(`Attempt ${attempts + 1}: Status ID = ${resultData.status?.id}, Description = ${resultData.status?.description}`);
                
                // Status IDs: 1 = In Queue, 2 = Processing, 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit Exceeded, 6 = Compilation Error, etc.
                if (resultData && resultData.status && resultData.status.id > 2) {
                    finalResult = resultData;
                    break;
                }
                
                attempts++;
            } catch (fetchError) {
                console.error(`Error fetching result on attempt ${attempts + 1}:`, fetchError);
                attempts++;
            }
        }

        if (!finalResult) {
            return NextResponse.json({ error: 'Timeout waiting for submission result.' }, { status: 408 });
        }

        // Log detailed result for debugging
        console.log('Final result:', {
            status: finalResult.status,
            stdout: finalResult.stdout,
            stderr: finalResult.stderr,
            compile_output: finalResult.compile_output
        });

        // Handle different status codes
        if (finalResult.status.id === 3) { // Accepted
            const actualOutput = finalResult.stdout ? finalResult.stdout.trim() : '';
            const expectedOutput = testCase.Output.trim();
            
            console.log(`Comparing outputs - Expected: "${expectedOutput}", Actual: "${actualOutput}"`);
            
            if (actualOutput === expectedOutput) {
                return NextResponse.json({ status: { description: 'Accepted' } });
            } else {
                return NextResponse.json({ 
                    status: { description: 'Wrong Answer' },
                    expected: expectedOutput,
                    actual: actualOutput
                });
            }
        } else if (finalResult.status.id === 6) { // Compilation Error
            return NextResponse.json({ 
                status: { description: 'Compilation Error' },
                compile_output: finalResult.compile_output,
                stderr: finalResult.stderr
            });
        } else {
            return NextResponse.json({ 
                status: { description: finalResult.status.description },
                stderr: finalResult.stderr,
                stdout: finalResult.stdout
            });
        }

    } catch (error) {
        console.error("Top-level submission error:", error);
        return NextResponse.json({ error: 'Server error processing your request.' }, { status: 500 });
    }
}