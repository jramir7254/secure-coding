import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { logger } from '@/lib/logger';
import { useSocket } from '@/hooks/use-socket';
import { backend } from '@/lib/backend';
import { adminKeys, type TeamSchema } from '@/features/admin/hooks/use-admin';
import { gameKeys } from './query-keys';



export interface GameSchema {
    id: string
    maxTeams: number
    isActive: boolean
    timeLimit: number
    startedAt: string | null
    endedAt: string | null
    teamsPlayed?: number | null
}






export function useCurrentGame() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return;

        socket.on('game_started', () => {
            logger.info('[Socket]: "game_started"')
            queryClient.invalidateQueries({ queryKey: gameKeys.current.base() });
        });

        return () => { socket.off('game_started') };
    }, []);

    return useQuery({
        queryKey: gameKeys.current.base(),
        queryFn: () => backend.get<GameSchema | null>({ root: 'games', route: '/current' }),
    })
}









export function usePastGames() {
    return useQuery({
        queryKey: gameKeys.previous(),
        queryFn: () => backend.get<GameSchema[]>({ root: 'games', route: '/past' }),
    })
}


export type LeaderboardData = {
    teamName: string,
    teamId: string,
    totalPoints: number,
}


export function useCurrentGameLeaderboard() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return;

        socket.on('leaderboard_updated', (data: { teamId: string, score: number, teamName: string }) => {
            logger.info('[Socket]: "leaderboard_updated"', data)
            queryClient.setQueryData(gameKeys.current.leaderboard(), (old: LeaderboardData[]) => {
                if (!old) return [{ ...data }]
                if (!old.some(l => l.teamId === data.teamId)) return [...old, { ...data, totalPoints: data.score }]
                return old.map(l => l.teamId === data.teamId ? { ...l, points: l.totalPoints = data.score } : l)
            })
            queryClient.invalidateQueries({ queryKey: gameKeys.current.leaderboard(), refetchType: 'none' });
        });

        return () => { socket.off('leaderboard_updated') };
    }, []);

    return useQuery({
        queryKey: gameKeys.current.leaderboard(),
        queryFn: () => backend.get<LeaderboardData[]>({ root: 'games', route: '/current/leaderboard' }),
    })
}


export function useTeamResults(teamdId: string) {

    return useQuery({
        queryKey: gameKeys.results(teamdId),
        queryFn: () => backend.get<TeamSchema[]>({ root: 'games', route: `/teams/${teamdId}/results` }),
    })
}


export function useOverallLeaderboard() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return;

        socket.on('leaderboard_updated', (data) => {
            logger.info('[Socket]: "leaderboard_updated"')
            queryClient.invalidateQueries({ queryKey: gameKeys.leaderboard() });
        });

        return () => { socket.off('leaderboard_updated') };
    }, []);

    return useQuery({
        queryKey: gameKeys.leaderboard(),
        queryFn: () => backend.get<TeamSchema[]>({ root: 'games', route: '/all/leaderboard' }),
    })
}






export function useCurrentGameTeams() {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        socket.on('team_joined', (data) => {
            logger.info('[Socket]: "team_joined"')
            queryClient.setQueryData(gameKeys.current.teams(), (oldTeams: TeamSchema[]) => {
                if (!oldTeams) return [data];
                return [data, ...oldTeams];
            });
        });

        return () => { socket.off('team_joined') };
    }, []);

    return useQuery({
        queryKey: gameKeys.current.teams(),
        queryFn: () => backend.get<TeamSchema[]>({ root: 'games', route: '/current/teams' }),
    })
}









export function useGame() {
    const socket = useSocket()

    const queryClient = useQueryClient()


    useEffect(() => {
        if (!socket) return; // 👈 guard in case socket isn’t ready yet

        // Listen for incoming messages
        socket.on('game_started', (data) => {
            console.log('here2')
            queryClient.invalidateQueries({ queryKey: gameKeys.current.base() });
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('game_started');
        };
    }, []);

    return useQuery({
        queryKey: gameKeys.current.base(),
        queryFn: () => backend.get<GameSchema | null>({ root: 'games', route: '/current' }),
    })
}