import React from 'react'
import Editor from './editor'
import FileTabs from './file-tabs'
import OutputTerminal from './terminal'
import { useCodeEditor } from '../../context/editor-context'
import { HeaderContent } from '@/components/blocks'
import RunButton from './run-button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useCurrentQuestion, useCurrentAttempt } from '../../hooks/use-question'
import { QuizButtons } from '../multiple-choice/multiple-choice-buttons'
import CountUpTimer from '@/components/blocks/countup'
import Instructions from '../shared/instructions'
import { Badge } from '@/components/ui/badge'
import DifficultyBadge from '../shared/difficulty-badge'
import NextButton from '../shared/next-button'

export default function CodeEditor() {
    const { currentFile } = useCodeEditor()
    const questionData = useCurrentQuestion()
    const attemptData = useCurrentAttempt()

    if (!questionData || !attemptData) return



    return (
        <ResizablePanelGroup direction='horizontal' className="flex h-full ">
            <ResizablePanel className="col-span-2 row-span-2 border border-t-0 bg-white/5" maxSize={15}>
                <div className='mt-13 w-full'>
                    <FileTabs />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel>
                <ResizablePanelGroup direction='vertical' className='col-span-9 row-span-2 size-full'>
                    <ResizablePanel defaultSize={75} className=''>
                        <HeaderContent className="flex justify-between items-center p-2 bg-editor-bg">
                            <DifficultyBadge difficulty={questionData.difficulty} />
                            <CountUpTimer />
                            <div className='ml-auto'>
                                <RunButton />
                            </div>
                            <NextButton />
                        </HeaderContent>

                        <div hidden={currentFile === 'instructions'} className='size-full'>
                            <Editor />
                        </div>
                        <div hidden={currentFile !== 'instructions'} className='bg-editor-bg size-full p-5'>
                            <Instructions />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={25} maxSize={75} className=' bg-editor-bg'>
                        {questionData.type === 'mcq' ? <QuizButtons data={{ attemptData, questionData }} /> : <OutputTerminal />}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
