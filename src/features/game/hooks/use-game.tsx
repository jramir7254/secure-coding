import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { socket } from '@/lib/socket';
import { useApi } from '@/hooks/use-api';
import { logger } from '@/lib/logger';
import { useSocket } from '@/hooks/use-socket';

export interface GameSchema {
    id: string
    maxTeams: number
    isCurrent: boolean
    timeLimit: number
    startedAt: number | string | null
    endedAt: number | null
}



export const gameKeys = {
    all: ['games'] as const,
    one: (gameId: number) => [...gameKeys.all, "one", gameId] as const,
    current: () => [...gameKeys.all, "current"] as const,
    previous: () => [...gameKeys.all, "previous"] as const,
    leaderboard: () => [...gameKeys.all, "leaderboard"] as const,

};


export function useCurrentGame() {
    const socket = useSocket()
    const { call } = useApi('games')
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return; // 👈 guard in case socket isn’t ready yet

        socket.on('game_started', () => {
            logger.info('[Socket]: "game_started"')
            queryClient.invalidateQueries({ queryKey: gameKeys.current() });
        });

        return () => { socket.off('game_started') };
    }, []);

    return useQuery({
        queryKey: gameKeys.current(),
        queryFn: () => call<GameSchema | null>('get', '/current'),
    })
}


export function useGame() {
    const socket = useSocket()

    const { call } = useApi('games')
    const queryClient = useQueryClient()


    useEffect(() => {
        if (!socket) return; // 👈 guard in case socket isn’t ready yet

        // Listen for incoming messages
        socket.on('game_started', (data) => {
            console.log('here2')
            queryClient.invalidateQueries({ queryKey: gameKeys.current() });
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('game_started');
        };
    }, []);

    return useQuery({
        queryKey: gameKeys.current(),
        queryFn: () => call<GameSchema | null>('get', '/current'),
    })
}


export function usePastGames() {
    const { call } = useApi('games')

    return useQuery({
        queryKey: gameKeys.previous(),
        queryFn: () => call<GameSchema[]>('get', '/past'),
    })
}



/**
 * 
 * @returns 
 */
export function useGameLeaderboard() {
    const socket = useSocket()

    const { call } = useApi('games')
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return; // 👈 guard in case socket isn’t ready yet

        socket.on('leaderboard_updated', (data) => {
            logger.info('[Socket]: "leaderboard_updated"')
            queryClient.invalidateQueries({ queryKey: gameKeys.leaderboard() });
        });

        return () => { socket.off('leaderboard_updated') };
    }, []);

    return useQuery({
        queryKey: gameKeys.leaderboard(),
        queryFn: () => call('get', '/leaderboard'),
    })
}