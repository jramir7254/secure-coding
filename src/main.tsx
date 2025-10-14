import './styles.css'
import { QuestionProvider } from './context/question-context';
import { Routes, Route } from "react-router";

import AuthPage from './features/auth/auth-page';
import GamePage from './features/game/game-page';
import AdminPage from './features/admin/admin-page';
import RequireAdmin from './components/admin-guard';
import { Toaster } from './components/ui/sonner';
import Header from './components/header';


export default function App() {

    return (
        <QuestionProvider>
            <Header />
            <main className='flex w-screen '>
                <Routes>
                    <Route path='/' element={<AuthPage />} />
                    <Route path='/:teamName' element={<GamePage />} />
                    <Route path='/admin' caseSensitive element={<RequireAdmin isPage><AdminPage /></RequireAdmin>} />
                </Routes>
                <Toaster richColors position='top-center' />
            </main>
        </QuestionProvider>
    );
}

