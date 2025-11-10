import React, { useState, useRef, useEffect } from 'react';
import Editor, { useMonaco, type Monaco } from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { constrainedEditor } from 'constrained-editor-plugin';
import type * as monacoType from 'monaco-editor';
import type { CodeFile, Question } from '../../types/questions';
import { logger } from '@/lib/logger';
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import { Button } from '@/components/ui';

const markdown = `
# Your markdown here
`

export default function CodeEditor({
    question,
    setInput,
}: {
    question: Question;
    setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const constrainedRef = useRef<any>(null); // ✅ Store constrained instance persistently

    const codeFiles = question.codeFiles
    const [file, setFile] = useState<CodeFile>(codeFiles[0]);




    const applyEditableRanges = (file: CodeFile) => {
        if (!editorRef.current || !monacoRef.current || !constrainedRef.current) return;
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) return;

        // Remove old restrictions before applying new ones
        try {
            constrainedRef.current.removeRestrictionsIn(model)
        } catch (err) { logger.error('Error in applyEditableRanges', err) }

        try {
            const rangeData = file?.editableRanges;
            logger.debug('Editable range:', rangeData);

            // Example expected format: [startLine, startColumn, endLine, endColumn]
            if (Array.isArray(rangeData) && rangeData.length === 4) {
                logger.info('Adding restrictions:');

                constrainedRef.current.addRestrictionsTo(model, [
                    {
                        range: rangeData,
                    },
                ]);

                // Optional: highlight editable area
                (model as any).toggleHighlightOfEditableAreas?.({
                    cssClassForSingleLine: 'editable-singleline-highlight',
                    cssClassForMultiLine: 'editable-multiline-highlight',
                });
            }
        } catch (err) {
            logger.error('Invalid editableRanges:', err);
        }
    };

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) {
            logger.warn('Editor null')
            return;
        }
        const editor = editorRef.current;

        let model = monacoRef?.current?.editor?.getModel(monacoRef.current.Uri.parse(`file:///${file.name}`));
        if (!model) {
            logger.warn('Model null')

            model = monacoRef.current.editor.createModel(file.value, file.language, monacoRef.current.Uri.parse(`file:///${file.name}`));
        }

        editor.setModel(model);
        applyEditableRanges(file);
    }, [file, monacoRef.current]);

    useEffect(() => {
        if (editorRef.current && monacoRef.current && constrainedRef.current) {
            applyEditableRanges(file);
        }
    }, [file, monacoRef.current, constrainedRef.current]);

    // ✅ When the editor first mounts
    function handleEditorDidMount(
        editor: monacoType.editor.IStandaloneCodeEditor,
        monacoInstance: Monaco
    ) {
        codeFiles.forEach(cf => {
            const uri = monacoInstance.Uri.parse(`file:///${cf.name}`);
            if (!monacoInstance.editor.getModel(uri)) {
                monacoInstance.editor.createModel(cf.value, cf.language, uri);
            }
        });

        editorRef.current = editor;
        constrainedRef.current = constrainedEditor(monacoInstance);
        constrainedRef.current.initializeIn(editor);
        monacoRef.current = monacoInstance;

        applyEditableRanges(file);
    }

    const handleEditorChange = (value: string | undefined) => {
        if (value) setInput(value);
    };

    const readOnly = file?.editableRanges[0] === 'readonly' ? true : false;


    async function run() {
        try {
            editorRef?.current?.getAction('editor.action.formatDocument')?.run();

            const models = monacoRef.current?.editor?.getModels?.();
            if (!models) return;

            const allModelValues = models.map(model => ({
                uri: model.uri.toString(),
                value: model.getValue(),
            }));

            logger.debug(allModelValues);
        } catch (error) {
            console.error('Error reading models:', error);
        }
    }


    return (
        <>
            <Tabs defaultValue={file.name} orientation='vertical'>
                <Button onClick={run} >Run</Button>

                <TabsList className="flex-col w-40 border-r rounded-none h-auto">

                    {codeFiles.map((cf) => (
                        <TabsTrigger
                            key={cf.name}
                            value={cf.name}
                            onClick={() => setFile(cf)}
                        >
                            {cf.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <Editor
                className=" overflow-hidden bg-[#1e1e1e] pt-4"
                height="50vh"
                theme="vs-dark"
                path={`file:///${file.name}`}
                defaultLanguage={file.language}
                defaultValue={file.value}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                    allowOverflow: false,
                    readOnly,
                    folding: false,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    autoIndent: "advanced", // enables smart indent behavior
                    formatOnType: true,     // auto-indent when typing
                    formatOnPaste: true,    // auto-indent pasted code

                }}
            />



        </>
    );
}
