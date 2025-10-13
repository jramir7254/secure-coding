import React from 'react'
import { useQuestionContext } from '@/context/question-context';


export default function OutputTerminal() {
    const { output } = useQuestionContext()

    return (
        <div className='font-mono'>out: {output}</div>
    )
}
