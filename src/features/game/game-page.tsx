import React, { useState } from 'react';
import { QuestionProvider } from '@/context/question-context';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/editor'
import { useQuestionContext } from '@/context/question-context';
import { QuizButtons } from './components/multiple-choice/multiple-choice-buttons';
import RunButton from './components/coding/run-button';
import OutputTerminal from './components/coding/output';
import LogoutButton from '../auth/components/logout-button';
import useAuth from '@/hooks/use-auth';
import ResetButton from '../auth/components/reset-button';
import { type QuestionVariant } from '@/context/question-context';
import { useCurrentGame } from './hooks/use-game';
import LobbyPage from './lobby-page';

export default function GamePage() {
    const [type, setType] = useState<QuestionVariant>('multiple')
    const { team, isAdmin } = useAuth()
    const { data: currentGame } = useCurrentGame()

    if (currentGame?.startedAt === null) return <LobbyPage />

    return (
        <section className='flex flex-1 size-full'>
            <div className='bg-accent flex-1'>
                <p>{team?.teamName}</p>
                <p>Team Id: {team?.id}</p>
                <p>isAdmin: {isAdmin() ? 'Yes' : 'No'}</p>
                <LogoutButton />
                <ResetButton />
            </div>
            <div className='p-12 w-[45%]'>
                {type === 'coding' ? <DebuggingView /> : <MultipleChoiceView setType={setType} />}
            </div>
            <div className='bg-accent flex-1'>
            </div>
        </section>
    )
}

function MultipleChoiceView({ setType }: { setType: React.Dispatch<React.SetStateAction<QuestionVariant>> }) {
    return (
        <>
            <CodeEditor />
            <QuizButtons setType={setType} />
            {/* <SubmitButton /> */}
        </>
    )
}



function DebuggingView() {
    return (
        <div className='h-full'>
            <div>
                <RunButton />
            </div>
            <CodeEditor />
            <OutputTerminal />
        </div>
    )
}
