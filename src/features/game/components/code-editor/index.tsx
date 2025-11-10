import React from 'react'
import Editor from './editor'
import FileTabs from './file-tabs'
import OutputTerminal from './terminal'
import { useCodeEditor } from '../../context/editor-context'
import { Block, Flex, Grid, Content, SideContent, HeaderContent, FooterContent, Container } from '@/components/blocks'
import RunButton from './run-button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Markdown from 'react-markdown'
import { useCurrentQuestion } from '../../hooks/use-question'
import { Separator } from '@/components/ui'
import { QuizButtons } from '../multiple-choice/multiple-choice-buttons'

export default function CodeEditor() {
    const { currentFile } = useCodeEditor()
    const { data } = useCurrentQuestion()

    if (!data) return

    const { attemptData, questionData } = data


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
                            <div className='ml-auto'>
                                <RunButton />
                            </div>
                        </HeaderContent>

                        <div hidden={currentFile === 'instructions'} className='size-full'><Editor /> </div>
                        <div hidden={currentFile !== 'instructions'} className='bg-editor-bg size-full p-5'>
                            <h2 className='font-nunit text-2xl'>{questionData.title}</h2>
                            <Separator />
                            <Markdown >
                                {questionData?.description}
                            </Markdown>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={25} maxSize={50}>
                        {questionData.type === 'mcq' ? <QuizButtons data={{ attemptData, questionData }} /> : <OutputTerminal />}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
