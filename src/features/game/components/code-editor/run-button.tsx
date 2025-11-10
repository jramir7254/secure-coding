import { Button } from '@/components/ui/button'
import React, { useState, type SetStateAction } from 'react'
import { Play } from 'lucide-react';
import { PistonApi } from '@/lib/api';
import { useCodingAttempt, useCurrentQuestionAttempt } from '../../hooks/use-question';
import { useCodeEditor } from '../../context/editor-context'
import { useCurrentQuestion } from '../../hooks/use-question';
import { logger } from '@/lib/logger';
import { loader } from '@monaco-editor/react';

export default function RunButton() {
    const { orderedFiles, currentFile, question, pushToTerminal } = useCodeEditor()
    const { data: qac } = useCurrentQuestion()
    const submitAttempt = useCurrentQuestionAttempt()
    const [loading, setIsLoading] = useState(false)

    if (!qac) return

    const { attemptData, questionData } = qac


    const shouldHide = question?.type === 'mcq'

    // const submitAttempt = useCodingAttempt({ questionId: question.id, attemptId, questionType: 'coding' })


    async function run() {
        try {
            setIsLoading(true)
            const monaco = await loader.init()
            const models = monaco?.editor?.getModels?.();
            if (!models) return;

            const allModelValues = models.filter(model => model.getValue().length).map(model => ({
                uri: model.uri.toString(),
                value: model.getValue(),
            }));

            logger.debug(allModelValues);
            // logger.info("input")
            const { output } = await submitAttempt.mutateAsync({ questionData, attemptData, submittedCode: allModelValues })
            // console.log("d", output)
            pushToTerminal(output)

        } catch (error: any) {
            console.debug('err', error)
            pushToTerminal(error.message)

        } finally {
            setIsLoading(false)

        }

    }

    return (
        <Button onClick={run} hidden={shouldHide} disabled={loading}>Run<Play /></Button>
    )
}
