import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor, { useMonaco, type Monaco } from '@monaco-editor/react';
import { constrainedEditor } from 'constrained-editor-plugin';
import type * as monacoType from 'monaco-editor';
import { logger } from '@/lib/logger';
import { useCodeEditor } from '../../context/editor-context'


export default function Editor() {
    const { orderedFiles, currentFile } = useCodeEditor()

    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const constrainedRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);



    const applyEditableRanges = () => {
        if (!editorRef.current || !monacoRef.current || !constrainedRef.current || !currentFile || typeof currentFile === 'string') return;
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) return;

        // Remove old restrictions before applying new ones
        try {
            constrainedRef.current.removeRestrictionsIn(model)
        } catch (err) { logger.error('Error in applyEditableRanges', err) }

        try {
            const rangeData = currentFile?.editableRanges;
            logger.debug('Editable range:', rangeData);
            logger.debug('Editable range type:', typeof rangeData);
            logger.debug('Editable range isArray:', Array.isArray(rangeData));
            logger.debug('Editable range length:', rangeData.length);

            // Example expected format: [startLine, startColumn, endLine, endColumn]
            if (Array.isArray(rangeData) && rangeData.length >= 1) {
                logger.info('Adding restrictions:', rangeData);


                const ranges = rangeData.map(range => {
                    logger.debug(`ranges[range]: ${range}`)
                    if (range.length <= 2) {
                        logger.debug(`range.length == 2: ${range.length <= 2}`)

                        return {
                            range: [range[0], model?.getLineMaxColumn(range[0]), range[1], model?.getLineMaxColumn(range[1])]
                        }
                    } else {
                        logger.debug(`range.length == 4: ${range.length >= 4}`)

                        return {
                            range
                        }
                    }
                })

                logger.table(ranges);
                logger.debug('ranges', ranges);




                constrainedRef.current.addRestrictionsTo(model, ranges);

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

        let model = monacoRef?.current?.editor?.getModel(monacoRef.current.Uri.parse(`file:///${currentFile?.name}`));
        if (!model) {
            logger.warn('Model null')

            model = monacoRef.current.editor.createModel(currentFile?.value || '', currentFile?.language, monacoRef.current.Uri.parse(`file:///${currentFile?.name}`));
        }

        editor.setModel(model);
        applyEditableRanges();
    }, [currentFile, monacoRef.current]);

    useEffect(() => {
        if (editorRef.current && monacoRef.current && constrainedRef.current) {
            applyEditableRanges();
        }
    }, [currentFile, monacoRef.current, constrainedRef.current]);

    // ✅ When the editor first mounts
    function handleEditorDidMount(
        editor: monacoType.editor.IStandaloneCodeEditor,
        monacoInstance: Monaco
    ) {
        orderedFiles.forEach(cf => {
            const uri = monacoInstance.Uri.parse(`file:///${cf.name}`);
            if (!monacoInstance.editor.getModel(uri)) {
                monacoInstance.editor.createModel(cf.value, cf.language, uri);
            }
        });

        editorRef.current = editor;
        constrainedRef.current = constrainedEditor(monacoInstance);
        constrainedRef.current.initializeIn(editor);
        monacoRef.current = monacoInstance;

        applyEditableRanges();
    }



    const readOnly = typeof currentFile === 'object' && currentFile?.editableRanges.length === 0 ? true : false;



    return (
        <MonacoEditor
            className="overflow-hidden bg-editor-bg pt-4 size-full max-h-full"
            height="95%"
            theme="vs-dark"
            path={currentFile?.name}
            defaultLanguage={currentFile?.language}
            defaultValue={currentFile?.value}
            onMount={handleEditorDidMount}
            options={{
                readOnly,
                folding: false,
                minimap: { enabled: false },
                automaticLayout: true,
            }}
        />
    );
}
