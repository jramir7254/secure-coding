import React from 'react'
import CodeEditor from './editor'
import { Block } from '@/components/blocks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Markdown from './markdown'
export default function TestPage() {
    return (
        <Block className='size-full'>
            <Tabs defaultValue='editor' className='size-full'>
                <TabsList>
                    <TabsTrigger value='editor'>Editor</TabsTrigger>
                    <TabsTrigger value='markdown'>Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value='editor' className='size-full flex-1'>
                    <CodeEditor />

                </TabsContent>
                <TabsContent value='markdown' className='size-full'>
                    <Markdown />

                </TabsContent>
            </Tabs>
        </Block>
    )
}
