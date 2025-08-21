import React from 'react';

interface TestResult {
    overallStatus?: string;
    status?: string;
    passedTests?: number;
    totalTests?: number;
    compile_output?: string;
    stderr?: string;
    details?: Array<{
        stderr: any;
        compile_output: any;
        passed?: boolean;
        expectedOutput?: string;
        actualOutput?: string;
        error?: {
            compile_output?: string;
            stderr?: string;
        };
        executionTime?: number;
        memoryUsed?: number;
    }>;
}

const TestResultDisplay = ({ result }: { result: TestResult }) => {
    // Safely determine if the result is accepted - handle both formats
    const isAccepted = result?.overallStatus === 'Accepted' || 
                      result?.status === 'Accepted' ||
                      (result?.details && result.details.every(d => d.passed === true));
    
    // Helper function to detect different types of errors with enhanced detection
    const detectError = (testCase: { passed?: boolean | undefined; expectedOutput?: string | undefined; actualOutput: any; error: any; executionTime: any; memoryUsed: any; compile_output?: any; stderr?: any; status?: any; }) => {
        // Handle null/undefined testCase
        if (!testCase) return null;

        // Handle JavaScript/Node.js runtime errors - updated to handle error object
        if (testCase.actualOutput?.includes('CAUGHT_ERROR:') || 
            testCase.error?.stderr?.includes('CAUGHT_ERROR:')) {
            const errorMessage = testCase.actualOutput?.replace('CAUGHT_ERROR:', '').trim() ||
                                testCase.error?.stderr?.replace('CAUGHT_ERROR:', '').trim();
            return {
                type: 'JavaScript Runtime Error',
                message: errorMessage,
                language: 'JavaScript',
                suggestion: 'Check for undefined variables, null references, or incorrect property access.'
            };
        }

        // Check for compilation errors in error object
        if (testCase.error?.compile_output) {
            return {
                type: 'Compilation Error',
                message: testCase.error.compile_output,
                language: 'System',
                suggestion: 'Fix syntax errors, missing declarations, or incorrect language syntax.'
            };
        }

        // Check for runtime errors in error object
        if (testCase.error?.stderr) {
            const stderr = testCase.error.stderr;
            
            // Java compilation and runtime errors
            if (stderr.includes('.java:') || stderr.includes('Exception') || stderr.includes('Error:')) {
                const isRuntimeError = stderr.includes('Exception') || stderr.includes('Error:');
                return {
                    type: isRuntimeError ? 'Java Runtime Error' : 'Java Compilation Error',
                    message: stderr,
                    language: 'Java',
                    suggestion: isRuntimeError 
                        ? 'Check for null pointer exceptions, array bounds, or logic errors.'
                        : 'Fix syntax errors, missing imports, or incorrect method signatures.'
                };
            }

            // C++ compilation and runtime errors
            if (stderr.includes('error:') || 
                stderr.includes('undefined reference') ||
                stderr.includes('fatal error') ||
                stderr.includes('.cpp:') ||
                stderr.includes('.cc:') ||
                stderr.includes('g++:')) {
                const isLinkError = stderr.includes('undefined reference');
                return {
                    type: isLinkError ? 'C++ Linking Error' : 'C++ Compilation Error',
                    message: stderr,
                    language: 'C++',
                    suggestion: isLinkError 
                        ? 'Check for missing function definitions or incorrect linking.'
                        : 'Fix syntax errors, missing headers, or incorrect declarations.'
                };
            }

            // Python errors with enhanced categorization
            if (stderr.includes('SyntaxError') || stderr.includes('IndentationError')) {
                return {
                    type: 'Python Syntax Error',
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check your indentation, brackets, colons, and Python syntax rules.'
                };
            }
            
            if (stderr.includes('ModuleNotFoundError') || stderr.includes('ImportError')) {
                return {
                    type: 'Python Import Error',
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check if the module name is correct and available in the environment.'
                };
            }
            
            if (stderr.includes('Traceback') || stderr.includes('Error:') || stderr.includes('Exception:')) {
                let errorType = 'Python Runtime Error';
                
                if (stderr.includes('NameError')) errorType = 'Python Name Error';
                else if (stderr.includes('TypeError')) errorType = 'Python Type Error';
                else if (stderr.includes('ValueError')) errorType = 'Python Value Error';
                else if (stderr.includes('AttributeError')) errorType = 'Python Attribute Error';
                else if (stderr.includes('IndexError')) errorType = 'Python Index Error';
                else if (stderr.includes('KeyError')) errorType = 'Python Key Error';
                
                return {
                    type: errorType,
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check variable names, data types, function arguments, and array/dictionary access.'
                };
            }

            // System-level runtime errors
            if (stderr.includes('Segmentation fault') ||
                stderr.includes('segfault') ||
                stderr.includes('SIGSEGV') ||
                stderr.includes('core dumped') ||
                stderr.includes('SIGABRT') ||
                stderr.includes('SIGFPE')) {
                return {
                    type: 'System Runtime Error',
                    message: stderr,
                    language: 'System',
                    suggestion: 'Check for memory access violations, null pointer dereference, or stack overflow.'
                };
            }

            // Return generic error for stderr
            return {
                type: 'Runtime Error',
                message: stderr,
                language: 'System',
                suggestion: 'Check your code logic and variable declarations.'
            };
        }

        // Legacy fallback for direct stderr/compile_output in testCase
        if (testCase.compile_output || (testCase.stderr?.includes('.java:'))) {
            const isRuntimeError = testCase.stderr?.includes('Exception') || testCase.stderr?.includes('Error:');
            return {
                type: isRuntimeError ? 'Java Runtime Error' : 'Java Compilation Error',
                message: testCase.compile_output || testCase.stderr,
                language: 'Java',
                suggestion: isRuntimeError 
                    ? 'Check for null pointer exceptions, array bounds, or logic errors.'
                    : 'Fix syntax errors, missing imports, or incorrect method signatures.'
            };
        }

        // C++ compilation and runtime errors
        if (testCase.stderr && (
            testCase.stderr.includes('error:') || 
            testCase.stderr.includes('undefined reference') ||
            testCase.stderr.includes('fatal error') ||
            testCase.stderr.includes('.cpp:') ||
            testCase.stderr.includes('.cc:') ||
            testCase.stderr.includes('g++:')
        )) {
            const isLinkError = testCase.stderr.includes('undefined reference');
            return {
                type: isLinkError ? 'C++ Linking Error' : 'C++ Compilation Error',
                message: testCase.stderr,
                language: 'C++',
                suggestion: isLinkError 
                    ? 'Check for missing function definitions or incorrect linking.'
                    : 'Fix syntax errors, missing headers, or incorrect declarations.'
            };
        }

        // Python errors with enhanced categorization
        if (testCase.stderr) {
            const stderr = testCase.stderr;
            
            // Syntax errors
            if (stderr.includes('SyntaxError') || stderr.includes('IndentationError')) {
                return {
                    type: 'Python Syntax Error',
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check your indentation, brackets, colons, and Python syntax rules.'
                };
            }
            
            // Import errors
            if (stderr.includes('ModuleNotFoundError') || stderr.includes('ImportError')) {
                return {
                    type: 'Python Import Error',
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check if the module name is correct and available in the environment.'
                };
            }
            
            // Runtime errors
            if (stderr.includes('Traceback') || stderr.includes('Error:') || stderr.includes('Exception:')) {
                let errorType = 'Python Runtime Error';
                
                if (stderr.includes('NameError')) errorType = 'Python Name Error';
                else if (stderr.includes('TypeError')) errorType = 'Python Type Error';
                else if (stderr.includes('ValueError')) errorType = 'Python Value Error';
                else if (stderr.includes('AttributeError')) errorType = 'Python Attribute Error';
                else if (stderr.includes('IndexError')) errorType = 'Python Index Error';
                else if (stderr.includes('KeyError')) errorType = 'Python Key Error';
                
                return {
                    type: errorType,
                    message: stderr,
                    language: 'Python',
                    suggestion: 'Check variable names, data types, function arguments, and array/dictionary access.'
                };
            }
        }

        // System-level runtime errors
        if (testCase.stderr && (
            testCase.stderr.includes('Segmentation fault') ||
            testCase.stderr.includes('segfault') ||
            testCase.stderr.includes('SIGSEGV') ||
            testCase.stderr.includes('core dumped') ||
            testCase.stderr.includes('SIGABRT') ||
            testCase.stderr.includes('SIGFPE')
        )) {
            return {
                type: 'System Runtime Error',
                message: testCase.stderr,
                language: 'System',
                suggestion: 'Check for memory access violations, null pointer dereference, or stack overflow.'
            };
        }

        // Check for status-based errors (Time Limit, Memory Limit, etc.)
        if (testCase.status) {
            const status = testCase.status.toLowerCase();
            
            if (status.includes('time limit') || status.includes('tle')) {
                return {
                    type: 'Time Limit Exceeded',
                    message: `Execution time: ${testCase.executionTime || 'Unknown'}ms`,
                    language: 'System',
                    suggestion: 'Optimize your algorithm for better time complexity. Consider more efficient data structures or algorithms.'
                };
            }
            
            if (status.includes('memory limit') || status.includes('mle')) {
                return {
                    type: 'Memory Limit Exceeded',
                    message: `Memory used: ${testCase.memoryUsed || 'Unknown'} KB`,
                    language: 'System',
                    suggestion: 'Optimize memory usage. Avoid storing unnecessary data or use more memory-efficient data structures.'
                };
            }
            
            if (status.includes('runtime error') || status.includes('re')) {
                return {
                    type: 'Runtime Error',
                    message: testCase.error?.stderr || 'Runtime error occurred during execution',
                    language: 'System',
                    suggestion: 'Check for array bounds, null pointer access, or division by zero.'
                };
            }
        }

        return null;
    };

    // Enhanced status display with better color coding
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'text-green-400';
            case 'wrong answer': return 'text-red-400';
            case 'time limit exceeded': return 'text-yellow-400';
            case 'memory limit exceeded': return 'text-orange-400';
            case 'runtime error': return 'text-red-400';
            case 'compilation error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    // Handle case where result is null or undefined
    if (!result) {
        return (
            <div className="p-4 flex justify-center">
                <p className="text-gray-400 font-md">Submission Results will be shown here</p>
            </div>
        );
    }

    const status = result.overallStatus || result.status || 'Unknown';
    const passedTests = result.passedTests ?? 0;
    const totalTests = result.totalTests ?? 0;

    return (
        <div className="">
            {/* Overall Status Section */}
            <div className="mb-4">
                <p className="mb-2">
                    <span className="font-semibold text-gray-200">Overall Status:</span> 
                    <span className={`ml-2 font-bold ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </p>
                
                {/* Test Progress */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-200">Tests Passed:</span> 
                    <span className={`ml-1 ${isAccepted ? 'text-green-400' : 'text-yellow-400'}`}>
                        {passedTests} / {totalTests}
                    </span>
                    {totalTests > 0 && (
                        <span className="text-gray-400 text-sm ml-2">
                            ({Math.round((passedTests / totalTests) * 100)}%)
                        </span>
                    )}
                </div>

                {/* Progress Bar */}
                {totalTests > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                                isAccepted ? 'bg-green-400' : 'bg-yellow-400'
                            }`}
                            style={{ width: `${Math.max((passedTests / totalTests) * 100, 5)}%` }}
                        />
                    </div>
                )}
            </div>
            
            {/* Compilation Error at Result Level - Check both locations */}
            {(result.compile_output || (result.details && result.details.some(d => d.error?.compile_output))) && (
                <div className="mt-4 p-4 border border-red-500 rounded-lg bg-red-900/20">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-bold text-red-400">Compilation Error</h4>
                    </div>
                    <pre className="bg-gray-800 p-3 rounded text-sm text-red-300 whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto font-mono">
                        {result.compile_output || result.details?.find(d => d.error?.compile_output)?.error?.compile_output}
                    </pre>
                    <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                        <p className="text-blue-300 text-sm">
                            💡 <strong>Quick Fix:</strong> The error shows exactly where the problem is - look for missing semicolons, brackets, or variable declarations at the specified line numbers.
                        </p>
                    </div>
                    
                    {/* Enhanced error parsing for common C++ errors */}
                    {((result.compile_output || '').includes('expected') || 
                      (result.details && result.details.some(d => (d.error?.compile_output || '').includes('expected')))) && (
                        <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                            <p className="text-yellow-300 text-xs">
                                <strong>Tip:</strong> "expected" errors usually mean missing punctuation like semicolons (;), brackets, or parentheses.
                            </p>
                        </div>
                    )}
                    
                    {((result.compile_output || '').includes('was not declared') || 
                      (result.details && result.details.some(d => (d.error?.compile_output || '').includes('was not declared')))) && (
                        <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                            <p className="text-yellow-300 text-xs">
                                <strong>Tip:</strong> Variables must be declared before use. Check if you've properly declared all your variables.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Runtime Error at Result Level - Check both locations */}
            {!result.compile_output && !result.details?.some(d => d.error?.compile_output) && 
             (result.stderr || result.details?.some(d => d.error?.stderr)) && (
                <div className="mt-4 p-4 border border-red-500 rounded-lg bg-red-900/20">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-bold text-red-400">Runtime Error</h4>
                    </div>
                    <pre className="bg-gray-800 p-3 rounded text-sm text-red-300 whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto font-mono">
                        {result.stderr || result.details?.find(d => d.error?.stderr)?.error?.stderr}
                    </pre>
                    <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                        <p className="text-blue-300 text-sm">
                            💡 <strong>Suggestion:</strong> Check your code for undefined variables, incorrect property access, or logic errors.
                        </p>
                    </div>
                </div>
            )}
            
            {/* Detailed Test Case Analysis - Only show if no compilation errors */}
            {!isAccepted && 
             !result.compile_output && 
             !result.details?.some(d => d.error?.compile_output) &&
             !result.stderr && 
             !result.details?.some(d => d.error?.stderr) && 
             (result.details?.length ?? 0) > 0 && (() => {
                const failedCase = result.details?.find(d => d && !d.passed);
                if (!failedCase) return null;
                //@ts-ignore
                const error = detectError(failedCase);
                const testIndex = (result.details?.findIndex(d => d && !d.passed) ?? -1) + 1;
                
                if (error) {
                    return (
                        <div className="mt-4 p-4 border border-red-500 rounded-lg bg-red-900/20">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-bold text-red-400">
                                    {error.type} (Test Case #{testIndex})
                                </h4>
                            </div>
                            <pre className="bg-gray-800 p-3 rounded text-sm text-red-300 whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto font-mono">
                                {error.message}
                            </pre>
                            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                                <p className="text-blue-300 text-sm">
                                    💡 <strong>Suggestion:</strong> {error.suggestion}
                                </p>
                            </div>
                        </div>
                    );
                }

                // Default case: Wrong Answer - Enhanced display
                return (
                    <div className="mt-4 p-4 border border-yellow-500 rounded-lg bg-yellow-900/20">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-bold text-yellow-400">Wrong Answer (Test Case #{testIndex})</h4>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <p className="font-semibold text-green-400 mb-1">✓ Expected Output:</p>
                                <pre className="bg-gray-800 p-3 rounded text-sm text-green-300 border-l-4 border-green-500 max-h-32 overflow-y-auto font-mono">
{failedCase.expectedOutput || 'No expected output available'}
                                </pre>
                            </div>
                            
                            <div>
                                <p className="font-semibold text-red-400 mb-1">✗ Your Output:</p>
                                <pre className="bg-gray-800 p-3 rounded text-sm text-red-300 border-l-4 border-red-500 max-h-32 overflow-y-auto font-mono">
{failedCase.actualOutput || 'No output produced'}
                                </pre>
                            </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                            <p className="text-blue-300 text-sm">
                                💡 <strong>Tip:</strong> Compare your output character by character. Check for extra spaces, missing newlines, or incorrect formatting.
                            </p>
                        </div>
                        
                        {/* Show execution details if available */}
                        {(failedCase.executionTime || failedCase.memoryUsed) && (
                            <div className="mt-2 text-xs text-gray-400 flex gap-4">
                                {failedCase.executionTime && (
                                    <span>⏱️ Time: {failedCase.executionTime}ms</span>
                                )}
                                {failedCase.memoryUsed && (
                                    <span>💾 Memory: {failedCase.memoryUsed}KB</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Success Message for Accepted Solutions */}
            {isAccepted && (
                <div className="mt-4 p-4 border border-green-500 rounded-lg bg-green-900/20">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-400 font-semibold">
                            🎉 Congratulations! Your solution passed all test cases.
                        </p>
                    </div>
                </div>
            )}

            {/* Check for compilation errors in test case details as fallback */}
            {!result.compile_output && !isAccepted && (result.details?.length ?? 0) > 0 && (() => {
                const failedCase = result.details?.find(d => d && !d.passed) ?? null;
                if (!failedCase) return null;

                // Check if there's a compilation error in the test case details
                if (failedCase.compile_output || (failedCase.stderr && (
                    failedCase.stderr.includes('error:') || 
                    failedCase.stderr.includes('fatal error') ||
                    failedCase.stderr.includes('.cpp:') ||
                    failedCase.stderr.includes('.java:') ||
                    failedCase.stderr.includes('SyntaxError')
                ))) {
                    return (
                        <div className="mt-4 p-4 border border-red-500 rounded-lg bg-red-900/20">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-bold text-red-400">Compilation Error</h4>
                            </div>
                            <pre className="bg-gray-800 p-3 rounded text-sm text-red-300 whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto font-mono">
                                {failedCase.compile_output || failedCase.stderr}
                            </pre>
                            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                                <p className="text-blue-300 text-sm">
                                    💡 <strong>Quick Fix:</strong> Check the line numbers mentioned in the error and fix the syntax issues.
                                </p>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* No Test Details Available */}
            {!isAccepted && !result.compile_output && !result.stderr && (!result.details || result.details.length === 0) && (
                <div className="">
                </div>
            )}
        </div>
    );
};

export default TestResultDisplay;