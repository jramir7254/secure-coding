import { createContext, useContext, useState } from "react";
type EditorActions = {
    output: string,
    setOutput: React.Dispatch<React.SetStateAction<string>>
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
}

export const EditorContext = createContext<EditorActions>()

const STARTER_CODE = 'public class MyClass {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}'


export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
    const [output, setOutput] = useState("")
    const [input, setInput] = useState(STARTER_CODE)

    const value = {
        output,
        setOutput,
        input,
        setInput
    }


    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    )
}

export const useEditorContext = () => useContext(EditorContext)

