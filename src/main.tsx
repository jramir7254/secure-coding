import './styles.css'
import { Routes, Route, Navigate } from "react-router";

import AuthPage from './features/auth/auth-page';
import GamePage from './features/game/game-page';
import AdminPage from './features/admin/admin-page';
import IndexPage from './features/game/index-page';
import RequireAdmin from './components/admin-guard';
import HowToPlayPage from './features/htp/htp-page';
import LobbyPage from './features/game/lobby-page';
import ResultsPage from './features/game/results-page';
import { Toaster } from './components/ui/sonner';
import Header from './components/header';
import { RequireAuth } from './components/admin-guard';
import LetterGlitch from './components/letters';
import QuestionsPage from './features/admin/questions-page';
import GamesPage from './features/admin/games-page';
import TeamsPage from './features/admin/teams-page';


export default function App() {

    return (
        <>
            <Header />
            <main className='flex w-screen relative bg-none'>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/how-to-play" element={<HowToPlayPage />} />

                    {/* Protected: Player routes */}
                    <Route element={<RequireAuth />}>
                        <Route path="/game" element={<IndexPage />}>
                            <Route path=":gameId/team/:teamName/waiting" element={<LobbyPage />} />
                            <Route path=":gameId/team/:teamName/live" element={<GamePage />} />
                            <Route path=":gameId/team/:teamName/results" element={<ResultsPage />} />
                        </Route>
                    </Route>

                    {/* Protected: Admin routes */}
                    <Route element={<RequireAuth requireAdmin />}>
                        <Route path="/admin/manage" element={<AdminPage />} >
                            <Route path='games' element={<GamesPage />} />
                            <Route path='questions' element={<QuestionsPage />} />
                            <Route path='teams' element={<TeamsPage />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                {/* <div className='absolute top-0 left-0 flex-1 size-full -z-1'>
                    <LetterGlitch
                        glitchSpeed={800}
                        centerVignette={true}
                        outerVignette={true}
                        smooth={true} />
                </div> */}
                <Toaster richColors position='top-center' />
            </main>
        </>
    );
}

