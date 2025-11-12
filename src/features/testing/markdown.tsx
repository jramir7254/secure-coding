import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Separator } from '@/components/ui'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'


export default function Markdown() {
    const [md, setMd] = useState("")
    return (
        <div className='size-full flex'>
            <div className='flex-1'>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={md} // controlled value
                    onChange={(e) => setMd(e.target.value)} // updates state
                />
            </div>
            <div className='flex-1'>
                <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {md}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
