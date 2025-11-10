
import { QuizButtons } from './components/multiple-choice/multiple-choice-buttons';

import { useTeam } from '../auth/hooks/use-team';

import { useCurrentQuestion } from './hooks/use-question';
import LeaderBoard from './components/shared/leaderboard';
import { Screen, Block, Section, Flex } from '@/components/blocks';
import { Heading } from '@/components/typography';
import { CodeEditorProvider } from './context/editor-context';
import Editor from './components/code-editor';

export default function GamePage() {

    return (

        <Screen className='flex'>

            <Section className=' w-[75%]'>
                <CodeEditorProvider>
                    <QuestionView />
                </CodeEditorProvider>
            </Section>

            <Section className='flex p-5 bg-white/5 w-[25%]'>
                <Flex className='size-full px-10'>
                    <Heading>Leaderboard</Heading>
                    <LeaderBoard />
                </Flex>
            </Section>

        </Screen>
    )
}





function QuestionView() {
    const { data } = useCurrentQuestion()

    if (!data) return <p>No question</p>
    // if (!('question' in data)) return <p>{(data as any).message || 'No question'}</p>


    return (
        <div className='h-full flex'>
            <Editor />

        </div>
    )
}

