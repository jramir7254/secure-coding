import React, { useState } from 'react'
import type { CodeFile, Question } from '../types/questions'

export type EditorHook = typeof useCodeEditor

export function useCodeEditor(question: Question) {
    const [currentfile, setCurrentFile] = useState<CodeFile>(question.codeFiles[0]);

    const orderedFiles = question.codeFiles.sort((file1, file2) => file1.displayOrder - file2.displayOrder)

    return {
        currentfile,
        orderedFiles,
        setCurrentFile
    }

}
