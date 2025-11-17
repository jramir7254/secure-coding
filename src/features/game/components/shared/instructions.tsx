import { ScrollArea } from '@/components/ui'

import Markdown from 'react-markdown'
import { useCurrentQuestion } from '../../hooks/use-question'
import { Separator } from '@/components/ui'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'


export default function Instructions() {
    const question = useCurrentQuestion()

    if (!question) return

    return (
        <ScrollArea className='h-full'>
            <h2 className='font-nunit text-2xl'>{question.title}</h2>
            <Separator />
            <article className="prose max-w-none dark:prose-invert">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                >
                    {question.description}
                </Markdown>
            </article>
        </ScrollArea>
    )
}
