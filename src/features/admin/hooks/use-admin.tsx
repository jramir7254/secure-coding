import React from 'react'
import { toast } from "sonner"
import * as GameApi from "@/features/game/api/game-api"
import { gameKeys } from '@/features/game/hooks/use-game'
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { useApi, type BaseBackendResponse, type ApiError } from '@/hooks/use-api'
import { type GameOptions } from "@/features/admin/components/create-game-form";

export default function useAdmin() {

    const { call } = useApi('admin')

    const resetDemo = async () => {
        try {
            const { message } = await call<BaseBackendResponse>('post', '/reset')
            toast.success(message)
        } catch (error: unknown) {
            toast.error((error as ApiError)?.message)
        }

    }

    return { resetDemo }
}



export function useCreateGame() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (form: GameOptions) => GameApi.createGame(form),
        onSuccess: () => {
            // Option A: immediate UI update
            // qc.setQueryData(userKeys.me, (prev: any) => ({ ...prev, ...data }));
            // Option B (or in addition): refetch fresh data
            qc.invalidateQueries({ queryKey: gameKeys.current })
        }
    });
}
