// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import type * as monaco from 'monaco-editor';
import React, { useState, useRef, type SetStateAction } from 'react';
import Editor, { DiffEditor, useMonaco, loader, type Monaco } from '@monaco-editor/react';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { constrainedEditor } from "constrained-editor-plugin";


export default function CodeEditor() {

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [fileName, setFileName] = useState('main.java');

    const file = files[fileName];

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editor;

        const constrainedInstance = constrainedEditor(monaco);
        constrainedInstance.initializeIn(editor);
        const model = editor.getModel();
        constrainedInstance.addRestrictionsTo(model, [
            {
                range: [1, model?.getLineMaxColumn(1), 5, model?.getLineMaxColumn(5)], // Range of Util Variable name
                allowMultiline: true,

                label: "utilName",
            },
            {
                range: [8, model?.getLineMaxColumn(8), 20, model?.getLineMaxColumn(20)], // Range of Util Variable name
                allowMultiline: true,

                label: "utilName",
            },

        ]);
        model?.toggleHighlightOfEditableAreas({
            cssClassForSingleLine: 'editable-singleline-highlight',
            cssClassForMultiLine: 'editable-multiline-highlight'
        });


    }


    const handleEditorChange = (value: string | undefined, event: any) => {
        console.log(editorRef.current?.getModel()?.getLineMaxColumn(5));
    };

    const run = () => {
        console.log(editorRef.current?.getValue())
    }

    return (
        <>
            <Button onClick={run}>Run</Button>
            <Tabs>
                <TabsList>
                    <TabsTrigger value='main.java' onClick={() => setFileName('main.java')}>Main.java</TabsTrigger>
                    <TabsTrigger value='person.java' onClick={() => setFileName('person.java')}>Person.java</TabsTrigger>
                    <TabsTrigger value='animal.java' onClick={() => setFileName('text.md')}>Animal.java</TabsTrigger>
                    <TabsTrigger value='1' onClick={() => setFileName('1')}>Animal.java</TabsTrigger>
                    <TabsTrigger value='2' onClick={() => setFileName('2')}>Animal.java</TabsTrigger>
                    <TabsTrigger value='3' onClick={() => setFileName('3')}>Animal.java</TabsTrigger>
                </TabsList>
            </Tabs>

            <Editor
                className='rounded-md overflow-hidden bg-[#1e1e1e] pt-4 size-full'

                height="50%"
                width={'50%'}
                theme="vs-dark" // Or 'vs-light', 'hc-black'
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}

                options={{
                    folding: false,
                    minimap: { enabled: false }, // Example option
                    // Add other Monaco editor options here
                }}
            />
        </>
    );
}



const files = {
    'main.java': {
        name: 'script.js',
        language: 'java',
        value: `
import java.util.*;

public class SensorMonitor {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== SENSOR MONITOR ===");
        System.out.print("Enter number of readings: ");
        int count = Integer.parseInt(sc.nextLine());

        double[] readings = new double[count];
        for (int i = 0; i <= count; i++) { // ❌ Off-by-one — ArrayIndexOutOfBounds
            System.out.print("Enter reading #" + (i + 1) + ": ");
            readings[i] = Double.parseDouble(sc.nextLine());
        }

        double avg = average(readings);
        System.out.println("Average temperature: " + avg);

        System.out.println("Loading calibration file...");
        simulateFileLoad("calibration.cfg"); // ❌ Throws exception, reveals details
    }

    public static double average(double[] arr) {
        double sum = 0;
        for (double d : arr) sum += d;
        return sum / arr.length;
    }

    public static void simulateFileLoad(String path) {
        try {
            if (!path.endsWith(".cfg")) {
                throw new Exception("Unsupported file type: " + path);
            }
            if (new Random().nextBoolean()) {
                throw new Exception("File not found: " + path);
            }
            System.out.println("File loaded successfully.");
        } catch (Exception e) {
            // ❌ Security flaw: leaking internal details
            e.printStackTrace();
        }
    }
}

            `,
    },
    'person.java': {
        name: 'style.css',
        language: 'css',
        value: "someCSSCodeExample",
    },
    'text.md': {
        name: 'text.md',
        language: 'markdown',
        value: "# Heading",
    },
    '1': {
        name: 'schema.sql',
        language: 'sql',
        value: "INSERT INTO",
    },
    '2': {
        name: 'server.log',
        language: 'plaintext',
        value: "[INFO] yurr",
    },
    '3': {
        name: '.db',
        language: 'database',
        value: "SECRET=1",
    },
};