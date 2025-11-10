declare module 'constrained-editor-plugin' {
    import * as monaco from 'monaco-editor';

    interface Restriction {
        range: monaco.IRange;
    }

    interface ConstrainedEditorInstance {
        initializeIn(editor: monaco.editor.IStandaloneCodeEditor): void;
        addRestrictionsTo(model: monaco.editor.ITextModel, restrictions: Restriction[]): void;
    }

    export function constrainedEditor(monacoInstance: typeof monaco): ConstrainedEditorInstance;
}
