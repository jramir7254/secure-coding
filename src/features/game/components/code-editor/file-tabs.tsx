import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCodeEditor } from '../../context/editor-context'


export default function FileTabs() {
    const { setCurrentFile, orderedFiles, currentFile } = useCodeEditor()

    return (
        <Tabs defaultValue={typeof currentFile === 'string' ? currentFile : currentFile.name} orientation='vertical'>

            <TabsList className="flex-col items-start p-0  rounded-none h-auto w-full bg-inherit overflow-hidden">
                <TabsTrigger
                    className='cursor-pointer rounded-none w-full justify-start bg-inherit font-nunit text-sm data-[state=active]:border-none'
                    value='instructions'
                    onClick={() => setCurrentFile('instructions')}
                >
                    Instructions
                </TabsTrigger>
                {orderedFiles?.map((cf) => (
                    <TabsTrigger
                        className='text-ellipsis cursor-pointer rounded-none w-full justify-start bg-inherit font-nunit text-sm data-[state=active]:border-none'
                        key={cf.name}
                        value={cf.name}
                        onClick={() => setCurrentFile(cf)}
                    >
                        {cf.name}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
