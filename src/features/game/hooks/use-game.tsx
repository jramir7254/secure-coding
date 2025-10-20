import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { socket } from '@/lib/socket';
import { useApi } from '@/hooks/use-api';
import { logger } from '@/lib/logger';
import { type GameSchema } from '@/features/admin/hooks/use-admin';
export const gameKeys = {
    all: ['games'] as const,
    current: ["games", "current"] as const,
    previous: ["games", "previous"] as const,
    leaderboard: ["games", "leaderboard"] as const,
};


export function useCurrentGame() {
    const queryClient = useQueryClient()
    const { call } = useApi('games')


    useEffect(() => {
        // Listen for incoming messages
        socket.on('game_started', (data) => {
            console.log('here2')
            queryClient.invalidateQueries({ queryKey: gameKeys.current });
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('game_started');
        };
    }, []);

    return useQuery({
        queryKey: gameKeys.current,
        queryFn: () => call<GameSchema | null>('get', '/current'),
    })
}


export function usePastGames() {
    const { call } = useApi('games')

    return useQuery({
        queryKey: gameKeys.previous,
        queryFn: () => call<GameSchema[]>('get', '/past'),
    })
}

export function useGameLeaderboard() {
    const { call } = useApi('games')

    const queryClient = useQueryClient()

    useEffect(() => {
        // Listen for incoming messages
        socket.on('leaderboard_updated', (data) => {
            logger.debug('leaderboard update')
            queryClient.invalidateQueries({ queryKey: gameKeys.leaderboard });
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('leaderboard_updated');
        };
    }, []);

    return useQuery({
        queryKey: gameKeys.leaderboard,
        queryFn: () => call('get', '/leaderboard'),

    })
}