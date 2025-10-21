// index-page.tsx
import React, { useEffect } from 'react';
import { useCurrentGame } from './hooks/use-game';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useTeam } from '../auth/hooks/use-team';

import { useSocket } from '@/hooks/use-socket';
export default function IndexPage() {
    const { data: currentGame, isLoading } = useCurrentGame();
    const { data: team } = useTeam();
    const location = useLocation();
    const navigate = useNavigate();
    const socket = useSocket();



    useEffect(() => {
        if (!socket || !currentGame) return;

        socket.on("game_started", () => {
            console.log('game_started')
            navigate(`/game/${currentGame.id}/team/${team?.teamName}/live`, { replace: true });
        });

        socket.on("game_ended", () => {
            navigate(`/game/${currentGame.id}/team/${team?.teamName}/results`, { replace: true });
        });

        return () => {
            socket.off("game_started");
            socket.off("game_ended");
        };
    }, [socket, currentGame, team, navigate]);

    if (isLoading) return <p>Loading game...</p>;
    if (!currentGame) return <Navigate to="/" replace />;

    const base = `/game/${currentGame.id}/team/${team?.teamName}`;

    // Only redirect if we are EXACTLY at /game
    if (location.pathname === '/game') {
        if (!currentGame.startedAt) return <Navigate to={`${base}/waiting`} replace />;
        if (currentGame.startedAt && !currentGame.endedAt) return <Navigate to={`${base}/live`} replace />;
        if (currentGame.endedAt) return <Navigate to={`${base}/results`} replace />;
    }

    // Otherwise, render child route (LobbyPage, GamePage, etc.)
    return <Outlet />;
}
