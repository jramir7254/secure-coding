// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';


import React, { useState, useRef } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { constrainedEditor } from 'constrained-editor-plugin';
import { useEditorContext } from '@/context/editor-context';
import { useQuestionContext } from '@/context/question-context';

export default function CodeEditor() {
    const editorRef = useRef(null);
    const { setInput, question, readOnly } = useQuestionContext()
    let restrictions = [];


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        const constrainedInstance = constrainedEditor(monaco);
        const model = editor.getModel();

        if (!readOnly) {

            constrainedInstance.initializeIn(editor);
            restrictions.push({
                range: [1, 7, 1, 13],
                allowMultiline: true
            });
            constrainedInstance.addRestrictionsTo(model, restrictions);
            constrainedInstance.toggleDevMode();
            model.toggleHighlightOfEditableAreas({
                cssClassForSingleLine: "editable-singleline-highlight",
                cssClassForMultiLine: "editable-multiline-highlight",
            });

            model.onDidChangeContentInEditableRange((changed, all, rangeObj) => {
                console.log("Changed inside:", rangeObj.label, changed, all);
            });
        }

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
            value={question?.code}
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

