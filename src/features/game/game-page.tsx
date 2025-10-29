import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CodeEditor from './components/shared/code-editor';
import { QuizButtons } from './components/multiple-choice/multiple-choice-buttons';
import RunButton from './components/coding/run-button';
import OutputTerminal from './components/coding/output';
import { useTeam } from '../auth/hooks/use-team';
import { useCurrentGame } from './hooks/use-game';
import LobbyPage from './lobby-page';
import CountdownTimer from '@/components/blocks/timer';
import { useCurrentQuestion } from './hooks/use-question';
import LeaderBoard from './components/shared/leaderboard';
import { Screen, Block, Section, Flex } from '@/components/blocks';
import { Separator } from '@/components/ui';
import { Heading } from '@/components/typography';



export default function GamePage() {
    const { data: team, isLoading, error } = useTeam();

    return (

        <Screen className=' flex'>

            <Section className='flex p-5 bg-white/5 w-[30%]'>
                <Flex className='size-full px-10'>
                    <Heading>Leaderboard</Heading>
                    <LeaderBoard />
                </Flex>
                <Separator orientation='vertical' className='border ml-auto' />
            </Section>

            <Section className='p-12  '>
                <QuestionView />
            </Section>

        </Screen>
    )
}





function QuestionView() {
    const { data } = useCurrentQuestion()
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState("")

    useEffect(() => {
        if (data && 'question' in data) {
            setInput(data.question.code || "")
        }
    }, [data])

    if (!data) return <p>No question</p>
    if (!('question' in data)) return <p>{(data as any).message || 'No question'}</p>

    const isMultiple = data.questionType === 'multiple'
    const isCoding = data.questionType === 'coding'


    return (
        <div className='h-full'>
            <div>
                <RunButton hidden={isMultiple} question={data.question} attemptId={data.attemptId} input={input || ""} setOutput={setOutput} />
            </div>
            <CodeEditor question={data.question} readOnly={isMultiple} setInput={setInput} />
            <QuizButtons hidden={isCoding} question={data.question} attemptId={data.attemptId} />
            <OutputTerminal hidden={isMultiple} output={output} />
        </div>
    )

}

