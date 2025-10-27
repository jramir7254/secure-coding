import { useEffect } from 'react'
import { toast } from "sonner"
import { gameKeys } from '@/features/game/hooks/use-game'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type GameOptions } from "@/features/admin/components/create-game-form";
import { useSocket } from '@/hooks/use-socket';
import { logger } from '@/lib/logger';
import { backend, type BaseBackendResponse, type ApiError } from '@/lib/backend';


export const adminKeys = {
    all: ['admin'] as const,
    teams: ["admin", "teams"] as const,
};

export function useAdmin() {
    const queryClient = useQueryClient();

    const resetDemo = async () => {
        try {
            const { message } = await backend.post<BaseBackendResponse>({
                root: 'admin',
                route: '/reset',
            })
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (form: GameOptions) =>
            backend.post<GameSchema>({
                root: 'games',
                route: '/create',
                payload: form,
            }),
        onSuccess: (data) => {
            toast.success(`Game #${data?.id} created successfully`)
            queryClient.invalidateQueries({ queryKey: gameKeys.current.base() })
        }
    });
}

export function useCloseGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            console.log('🟡 CloseGame mutation started');
            const result = await backend.post({
                root: 'games',
                route: '/close',
            });
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
    id: string,
    teamName: string,
    accessCode?: string,
    gameId?: number,
    points?: number
}

export function useDeleteTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamId: number) => backend.delete({
            root: 'admin',
            route: `/team/${teamId}`,
        }),
        onSuccess: (data, teamId) => {
            queryClient.setQueryData(adminKeys.teams, (oldTeams: any[] | undefined) => {
                if (!oldTeams) return [];
                return oldTeams.filter((team) => team.id !== teamId);
            });
            toast.success(`Team #${teamId} deleted`);
        }
    });

}



