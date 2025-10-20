import { useEffect } from 'react';
import { useTeam } from './hooks/use-team';
import AuthForm from './components/auth-form';
import useAppNavigation from '@/hooks/use-nav';
import LetterGlitch from '@/components/letter-glitch';

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
        <section className="flex-1 relative grid grid-cols-2   text-white overflow-hidden">
            <div className="col-span-1 z-1 h-full p-10">
                <AuthForm />
            </div>

            <div className='absolute top-0 flex-1 size-full'>
                <LetterGlitch
                    className=''
                    glitchSpeed={100}
                    centerVignette={false}
                    outerVignette={false}
                    smooth={true} />
            </div>
        </section>
    );
}










{/* <AnimatedGradient />
            <GridOverlay /> */}




// --- Theme Tokens (Cyber Violet) ---
// const theme = {
//     bgStart: "#0b1022",
//     bgEnd: "#17122b",
//     neon: "#a855f7",
//     neonSoft: "#8b5cf6",
//     cyan: "#22d3ee",
//     success: "#10b981",
//     danger: "#ef4444",
//     text: "#e5e7eb",
//     subtext: "#94a3b8",
// };



// function AnimatedGradient() {
//     return (
//         <div
//             aria-hidden
//             className="pointer-events-none absolute inset-0 z-0 w-full h-full"
//             style={{
//                 background: `radial-gradient(1200px 800px at 20% 0%, ${theme.neon}11, transparent 60%), radial-gradient(1000px 600px at 80% 20%, ${theme.cyan}0f, transparent 60%), linear-gradient(120deg, ${theme.bgStart}, ${theme.bgEnd})`,
//                 animation: "bg-pan 18s linear infinite",
//             }}
//         >
//             <style>{`
//         @keyframes bg-pan { 0%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(20deg)} 100%{filter:hue-rotate(0deg)} }
//       `}</style>
//         </div>
//     );
// }

// function GridOverlay() {
//     const gridColor = "rgba(175, 163, 50, 0.3)";
//     return (
//         <svg className="pointer-events-none absolute inset-0 z-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//                 <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
//                     <path d="M 32 0 L 0 0 0 32" fill="none" stroke={gridColor} strokeWidth="1" />
//                 </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#grid)" />
//         </svg>
//     );
// }
