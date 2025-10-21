import { useEffect } from 'react';
import { useTeam } from './hooks/use-team';
import AuthForm from './components/auth-form';
import useAppNavigation from '@/hooks/use-nav';
import LetterGlitch from '@/components/letter-glitch';
import { Flex } from '@/components/blocks';

export default function AuthPage() {
    const { data: team, isLoading, error } = useTeam();
    const { toGame } = useAppNavigation();

    useEffect(() => {
        if (!isLoading && team) {

            if (team) {
                toGame(team.teamName);
            }
        }
    }, []); // ✅ triggers whenever login state changes

    return (
        <Flex centered className="flex-1 relative bg-transparent">
            <Flex centered className='z-1' onFocus={() => console.log('f')}>
                <h1 className='text-6xl font-aldri'>Secure Coding</h1>
                <AuthForm />
            </Flex>

            <div className='absolute top-0 left-0 flex-1 size-full '>
                <LetterGlitch
                    glitchSpeed={150}
                    centerVignette={true}
                    outerVignette={true}
                    smooth={true} />
            </div>
        </Flex>
    );
}






