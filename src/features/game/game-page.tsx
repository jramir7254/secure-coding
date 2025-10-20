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




export default function GamePage() {
    const { data: team, isLoading, error } = useTeam();
    const { data: currentGame } = useCurrentGame()



    return (
        // <QuestionProvider>

        <section className='flex flex-1 size-full'>
            {/* <AnimatedGradient />
            <GridOverlay /> */}
            <div className='z-1 flex-1'>
                <p>{team?.teamName}</p>
                <p>Team Id: {team?.id}</p>
                <LeaderBoard />
            </div>
            <div className='p-12 w-[45%] z-1 '>
                <QuestionView />
            </div>
            <div className='flex-1 z-1 '>
                <CountdownTimer />
            </div>
        </section>
        // </QuestionProvider>
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


const theme = {
    bgStart: "#0b1022",
    bgEnd: "#17122b",
    neon: "#a855f7",
    neonSoft: "#8b5cf6",
    cyan: "#22d3ee",
    success: "#10b981",
    danger: "#ef4444",
    text: "#e5e7eb",
    subtext: "#94a3b8",
};



function AnimatedGradient() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 w-full h-full"
            style={{
                background: `radial-gradient(1200px 800px at 20% 0%, ${theme.neon}11, transparent 60%), radial-gradient(1000px 600px at 80% 20%, ${theme.cyan}0f, transparent 60%), linear-gradient(120deg, ${theme.bgStart}, ${theme.bgEnd})`,
                animation: "bg-pan 18s linear infinite",
            }}
        >
            <style>{`
        @keyframes bg-pan { 0%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(20deg)} 100%{filter:hue-rotate(0deg)} }
      `}</style>
        </div>
    );
}

function GridOverlay() {
    const gridColor = "rgba(175, 163, 50, 0.3)";
    return (
        <svg className="pointer-events-none absolute inset-0 z-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke={gridColor} strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    );
}
