import React from 'react'
import CodeEditor from './editor'
import { Block } from '@/components/blocks'
export default function TestPage() {
    return (
        <Block className='size-full'>
            <CodeEditor />
        </Block>
    )
}
