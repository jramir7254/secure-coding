import { Block } from '@/components/blocks'
import React from 'react'
import { useTeam } from '@/features/auth/hooks/use-team'
import { ScrollArea } from '@/components/ui'

export default function OutputTerminal({ hidden, output }: { hidden: boolean, output: string }) {
    const { data } = useTeam()

    if (!data) return null

    const { teamName } = data

    return (
        <Block hidden={hidden} className='font-consolas bg-accent h-50 rounded-none p-2'>
            <ScrollArea>
                <p>
                    <span className='text-lime-400'>{teamName}@DESKTOP-90KNBL2</span>
                    <span className='text-purple-300'> MINGW64</span>
                    <span className='text-orange-300'> ~/secure-coding</span>
                    {output}
                </p>
            </ScrollArea>
        </Block>
    )
}
