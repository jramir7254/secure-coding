import './styles.css'
import { Routes, Route, Navigate } from "react-router";

import AuthPage from './features/auth/auth-page';
import GamePage from './features/game/game-page';
import AdminPage from './features/admin/admin-page';
import IndexPage from './features/game/index-page';
import RequireAdmin from './components/admin-guard';
import LobbyPage from './features/game/lobby-page';
import ResultsPage from './features/game/results-page';
import { Toaster } from './components/ui/sonner';
import Header from './components/header';
import { RequireAuth } from './components/admin-guard';


export default function App() {

    return (
        <>
            <Header />
            <main className='flex w-screen'>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<AuthPage />} />

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
                        <Route path="/admin/manage" element={<AdminPage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster richColors position='top-center' />
            </main>
        </>
    );
}

