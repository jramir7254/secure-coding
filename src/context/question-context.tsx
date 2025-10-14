import { createContext, useContext, useEffect, useState } from "react";
import useQuestion from "@/hooks/use-question";
import { BackendApi } from '@/lib/api';


type QuestionContext = {
    output: string,
    question: Question,
    setOutput: React.Dispatch<React.SetStateAction<string>>
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
    readOnly: boolean,
    setReadOnly: React.Dispatch<React.SetStateAction<boolean>>
}


const blankQuestion = {
    output: '',
    question: { code: '', answer: null, type: null, editableRanges: [] },
    setOutput: () => { },
    input: '',
    setInput: () => { },
    readOnly: true,
    setReadOnly: () => { },
}

export const QuestionContext = createContext<QuestionContext>(blankQuestion)

export type Answer = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;

export type QuestionVariant = 'multiple' | 'coding' | null

export type Question = { code: string, answer: Answer, type: QuestionVariant, editableRanges: number[] }




export const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
    const [output, setOutput] = useState("")
    const [readOnly, setReadOnly] = useState(true)
    const [question, setQuestion] = useState<Question>({
        code: '',
        answer: null,
        type: null,
        editableRanges: []
    })
    const [input, setInput] = useState("")


    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await BackendApi.get<Question>('/questions');
                console.log('data', data);
                setQuestion(data); // Set the fetched data to state
                setInput(data.code)
            } catch (err) {
                console.error('An unexpected error occurred:', err);

            }
        };
        fetchQuestion();
    }, []); // Removed `question` from dependency array to prevent infinite loop

    const value = {
        output,
        question,
        setOutput,
        input,
        readOnly,
        setReadOnly,
        setInput
    }


    return (
        <QuestionContext.Provider value={value}>
            {children}
        </QuestionContext.Provider>
    )
}

export const useQuestionContext = () => useContext(QuestionContext)

