// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';


import React, { useState, useRef, type SetStateAction } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { Question } from '../../hooks/use-question';

export default function CodeEditor({ question, readOnly, setInput }: { question: Question, readOnly: boolean, setInput: React.Dispatch<SetStateAction<string>> }) {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

    }


    const handleEditorChange = (value, event) => {
        console.log("Changed inside:", value, event);

        setInput(value)
    };



    return (

        <Editor
            className='rounded-md overflow-hidden bg-[#1e1e1e] pt-4'
            height="50%"

            language="java" // Set the language to 'java'
            theme="vs-dark" // Or 'vs-light', 'hc-black'
            value={question.code}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}

            options={{
                folding: false,
                readOnly,
                minimap: { enabled: false }, // Example option
                // Add other Monaco editor options here
            }}
        />
    );
}

