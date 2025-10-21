import React, { useEffect } from 'react'
import { toast } from "sonner"
import { gameKeys } from '@/features/game/hooks/use-game'
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { useApi, type BaseBackendResponse, type ApiError } from '@/hooks/use-api'
import { type GameOptions } from "@/features/admin/components/create-game-form";
import type { queryClient } from '@/lib/query-client';
import { socket } from '@/lib/socket';
import { useSocket } from '@/hooks/use-socket';
import { logger } from '@/lib/logger';


export const adminKeys = {
    all: ['admin'] as const,
    teams: ["admin", "teams"] as const,
};

export function useAdmin() {
    const { call } = useApi('admin')
    const queryClient = useQueryClient();

    const resetDemo = async () => {
        try {
            const { message } = await call<BaseBackendResponse>('post', '/reset')
            toast.success(message)
            queryClient.invalidateQueries({ queryKey: gameKeys.all })
        } catch (error: unknown) {
            toast.error((error as ApiError)?.message)
        }

    }

    return { resetDemo }
}


export interface GameSchema {
    id: string
    maxTeams: number
    isCurrent: boolean
    timeLimit: number
    startedAt: number | string | null
    endedAt: number | null
}





export function useEndGame() {
    const socket = useSocket();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!socket) throw new Error('Socket not connected');
            socket.emit("end_game");
            return;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: gameKeys.all }),
    });
}



export function useCreateGame() {
    const { call } = useApi('games')
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (form: GameOptions) => call<GameSchema>('post', '/create', form),
        onSuccess: (data) => {
            toast.success(`Game #${data?.id} created successfully`)
            queryClient.invalidateQueries({ queryKey: gameKeys.current() })
        }
    });
}

export function useCloseGame() {
    const { call } = useApi('games')
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async () => {
            console.log('🟡 CloseGame mutation started');
            const result = await call('post', '/close');
            console.log('🟢 CloseGame mutation finished');
            return result;
        },
        onSuccess: async () => {
            console.log('Invalidating:', gameKeys.all);
            await queryClient.invalidateQueries({ queryKey: gameKeys.all, exact: false });
        },
        onError: (err) => console.error('Close game failed:', err),

    });
}

export type TeamSchema = {
    id: number,
    teamName: string,
    accessCode: string,
    gameId: number,
    points?: number
}

export function useDeleteTeam() {
    const { call } = useApi('admin')
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamId: number) => call('delete', `/team/${teamId}`),
        onSuccess: (data, teamId) => {
            queryClient.setQueryData(adminKeys.teams, (oldTeams: any[] | undefined) => {
                if (!oldTeams) return [];
                return oldTeams.filter((team) => team.id !== teamId);
            });
            toast.success(`Team #${teamId} deleted`);
        }
    });

}



export function useCurrentGameTeams() {
    const socket = useSocket();
    const { call } = useApi('admin')
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return; // 👈 guard in case socket isn’t ready yet

        socket?.on('team_joined', (data) => {
            logger.info('[Socket]: "team_joined"')
            queryClient.setQueryData(adminKeys.teams, (oldUsers: TeamSchema[]) => {
                if (!oldUsers) return [data];
                return [...oldUsers, data];
            });
        });

        return () => { socket?.off('team_joined') };
    }, []);

    return useQuery({
        queryKey: adminKeys.teams,
        queryFn: () => call<TeamSchema[]>('get', '/teams'),
    })
}


