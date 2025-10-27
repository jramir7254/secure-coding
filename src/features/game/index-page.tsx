import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { useCurrentGame } from './hooks/use-game';
import { useTeam } from '../auth/hooks/use-team';
import { useSocket } from '@/hooks/use-socket';
import { logger } from '@/lib/logger';

export default function IndexPage() {
    const { data: currentGame, isLoading } = useCurrentGame();
    const { data: team } = useTeam();
    const navigate = useNavigate();
    const socket = useSocket();
    const location = useLocation();

    // Handle socket events
    useEffect(() => {
        if (!socket || !currentGame) return;

        socket.on('game_started', () => {
            logger.info('[Socket] game_started');
            if (!currentGame.endedAt)
                navigate(`/game/${currentGame.id}/team/${team?.teamName}/live`, { replace: true });
        });

        socket.on('game_ended', () => {
            logger.info('[Socket] game_ended');
            navigate(`/game/${currentGame.id}/team/${team?.teamName}/results`, { replace: true });
        });

        return () => {
            socket.off('game_started');
            socket.off('game_ended');
        };
    }, [socket, currentGame, team, navigate]);

    // Redirect logic (useEffect instead of inline Navigate)
    useEffect(() => {
        if (isLoading || !team) return;
        if (!currentGame) {
            logger.info('no current game, redirecting to results...');
            navigate(`/game/${team.gameId}/team/${team.teamName}/results`, { replace: true });
            return;
        }

        if (currentGame.id !== team?.gameId) {
            logger.info('current game is not team game', { path: `/game/${team?.gameId}/team/${team?.teamName}/results` })
            navigate(`/game/${team?.gameId}/team/${team?.teamName}/results`, { replace: true })
        }

        if (location.pathname === '/game') {
            const base = `/game/${currentGame.id}/team/${team.teamName}`;
            if (!currentGame.startedAt) navigate(`${base}/waiting`, { replace: true });
            else if (!currentGame.endedAt) navigate(`${base}/live`, { replace: true });
            else navigate(`${base}/results`, { replace: true });
        }
    }, [isLoading, team, currentGame, location.pathname, navigate]);

    if (isLoading) return <p>Loading game...</p>;

    // Always keep outlet rendered so children can mount
    return <Outlet />;
}
