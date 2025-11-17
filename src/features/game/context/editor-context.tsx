import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CodeFile, Question } from '../types/questions';
import { useCurrentQuestion, useCurrentAttempt } from '../hooks/use-question';
import { logger } from '@/lib/logger';
export type CodeEditorContextType = ReturnType<typeof _useCodeEditorValues>;



function _useCodeEditorValues() {
    const question = useCurrentQuestion();
    const attempt = useCurrentAttempt();

    const [currentFile, setCurrentFile] = useState<CodeFile | 'instructions'>("instructions");
    const [codeOutput, setCodeOutput] = useState([""]);


    const pushToTerminal = (str: string) => {
        setCodeOutput(old => [...old, str])
    }
    const clearTerminal = () => {
        setCodeOutput([""])
    }

    useEffect(() => {
        logger.debug(`[attempt.id]: ${attempt?.id}`)
        setCurrentFile('instructions')
    }, [attempt?.id])

    // Set initial file once data is loaded


    // Derive ordered files safely and immutably
    const orderedFiles = useMemo(() => {
        if (!question?.codeFiles) return [];
        return [...question.codeFiles].sort(
            (a, b) => a.displayOrder - b.displayOrder
        );
    }, [question?.codeFiles]);

    return {
        currentFile,
        orderedFiles,
        setCurrentFile,
        codeOutput,
        pushToTerminal,
        setCodeOutput,
        clearTerminal,
        question
    };
}




const CodeEditorContext = createContext<CodeEditorContextType | null>(null);


export function CodeEditorProvider({ children }: { children: React.ReactNode }) {
    const value = _useCodeEditorValues();

    return (
        <CodeEditorContext.Provider
            value={value}
        >
            {children}
        </CodeEditorContext.Provider>
    );
};


export const useCodeEditor = () => {
    const ctx = useContext(CodeEditorContext);
    if (!ctx) throw new Error("useCodeEditor must be used within a CodeEditorProvider");
    return ctx;
};