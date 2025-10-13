import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useQuestionContext } from '@/context/question-context';
import { Play } from 'lucide-react';
import { PistonApi } from '@/lib/api';


export default function RunButton() {
    const { setOutput, input } = useQuestionContext()
    const [loading, setIsLoading] = useState(false)
    console.log(input)

    async function run() {
        try {
            setIsLoading(true)
            const { data } = await PistonApi.post('/execute', {
                "language": "java",
                "version": "15.0.2",
                "files": [
                    {
                        "name": "Main.java",
                        "content": input
                    }
                ],
                "stdin": "",
                "args": []
            })

            const { run } = data

            console.log({ o: run.stdout })
            console.log({ o: run.stderr })
            setOutput(run.stdout || run.stderr)
        } catch (error) {

        } finally {
            setIsLoading(false)

        }

    }

    return (
        <Button onClick={run} disabled={loading}>Run<Play /></Button>
    )
}
