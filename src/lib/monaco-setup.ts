// src/monacoSetup.js
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution.js";
import atomOneDark from "monaco-themes/themes/Tomorrow-Night.json";
import amy from "monaco-themes/themes/Dracula.json";

// Import all necessary language workers
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// Tell Monaco which worker to use for which language

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

loader.config({ monaco });
// Try to register the themes synchronously so editors that mount immediately can
// reference them via the `theme` prop (avoids a race where `defineTheme` runs
// after an Editor has already been created).
try {
    if (monaco && monaco.editor && typeof monaco.editor.defineTheme === 'function') {
        monaco.editor.defineTheme("atom-one-dark", atomOneDark as monaco.editor.IStandaloneThemeData);
        monaco.editor.defineTheme("dracula", amy as monaco.editor.IStandaloneThemeData);
    }
} catch (e) {
    // If defining synchronously fails for whatever reason, fall back to defining
    // the themes after loader.init() below.
}

loader.init().then(monaco => {
    // Ensure themes are defined in the AMD-loaded monaco instance as well
    try {
        monaco.editor.defineTheme("atom-one-dark", atomOneDark as monaco.editor.IStandaloneThemeData);
        // monaco.editor.defineTheme("dracula", amy as monaco.editor.IStandaloneThemeData);
    } catch (e) {
        // swallow - not critical
    }

    // Optionally set a default theme here (commented out so it doesn't force a
    // global theme on load):
    // monaco.editor.setTheme('atom-one-dark');
});
export default monaco;
