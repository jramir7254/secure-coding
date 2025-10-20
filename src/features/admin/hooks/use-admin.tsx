import React, { useEffect } from 'react'
import { toast } from "sonner"
import { gameKeys } from '@/features/game/hooks/use-game'
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { useApi, type BaseBackendResponse, type ApiError } from '@/hooks/use-api'
import { type GameOptions } from "@/features/admin/components/create-game-form";
import type { queryClient } from '@/lib/query-client';
import { socket } from '@/lib/socket';
import { useSocket } from '@/hooks/use-socket'


export const adminKeys = {
    all: ['admin'] as const,
    teams: ["admin", "teams"] as const,
};

export function useAdmin() {
    const qc = useQueryClient();

    const { call } = useApi('admin')

    const resetDemo = async () => {

        try {
            const { message } = await call<BaseBackendResponse>('post', '/reset')

            toast.success(message)
            qc.invalidateQueries({ queryKey: gameKeys.all })
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



export function useCreateGame() {
    const { call } = useApi('games')

    const qc = useQueryClient();
    return useMutation({
        mutationFn: (form: GameOptions) => call<GameSchema>('post', '/create', form),
        onSuccess: (data) => {
            toast.success(`Game #${data?.id} created successfully`)

            // qc.setQueryData(userKeys.me, (prev: any) => ({ ...prev, ...data }));
            // Option B (or in addition): refetch fresh data
            qc.invalidateQueries({ queryKey: gameKeys.current })
        }
    });
}


export function useEndGame() {
    const socket = useSocket();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!socket) throw new Error('Socket not connected');
            socket.emit("end_game");
            return;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: gameKeys.all }),
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



    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamId: number) => call('delete', `/team/${teamId}`),

        onSuccess: (data, teamId) => {
            qc.setQueryData(adminKeys.teams, (oldTeams: any[] | undefined) => {
                if (!oldTeams) return [];
                // ✅ filter out the deleted one
                return oldTeams.filter((team) => team.id !== teamId);
            });

            toast.success(`Team #${teamId} deleted`);
        }
    });

}

export function useCurrentGameTeams() {
    const { call } = useApi('admin')
    const qc = useQueryClient();

    useEffect(() => {
        // Listen for incoming messages
        socket.on('team_joined', (data) => {
            console.log('team joined', data)
            qc.setQueryData(adminKeys.teams, (oldUsers: TeamSchema[]) => {
                if (!oldUsers) return [data]; // if no data yet
                return [...oldUsers, data];
            });
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('team_joined');
        };
    }, []);
    return useQuery({
        queryKey: adminKeys.teams,
        queryFn: () => call<TeamSchema[]>('get', '/teams'),
    })
}


