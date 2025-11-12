import { Block } from '@/components/blocks'
import { useTeam } from '@/features/auth/hooks/use-team'
import { ScrollArea } from '@/components/ui'
import { useCodeEditor } from '../../context/editor-context'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui'



export default function OutputTerminal() {
    const { data } = useTeam()
    const { question, codeOutput, clearTerminal } = useCodeEditor()

    const shouldHide = question?.type === 'mcq'

    if (!data) return null

    const { teamName } = data

    return (
        <Block hidden={shouldHide} className='font-nunit bg-editor-bg h-full rounded-none p-2 border-l-0 relative'>
            <Button size='icon' onClick={clearTerminal} variant='default' className='absolute top-5 right-5 z-1'><Eraser /></Button>
            <ScrollArea className='h-full'>
                {codeOutput.map(out => (
                    <>
                        <pre className='font-nunit'>{out}</pre>
                        <CommandLine teamName={teamName} />
                    </>
                ))}
            </ScrollArea>
        </Block>
    )
}


const CommandLine = ({ teamName }: { teamName: string }) => (

    <p className='mt-5'>
        <span className='text-lime-400'>{teamName}@DESKTOP-90KNBL2</span>
        <span className='text-purple-300'> MINGW64</span>
        <span className='text-orange-300'> ~/secure-coding</span>
    </p>
)
