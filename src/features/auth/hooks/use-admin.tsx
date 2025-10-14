import React from 'react'
import { reset } from '../api/admin-api'
import { toast } from "sonner"
import * as GameApi from "@/features/game/api/game-api"
import { gameKeys } from '@/features/game/hooks/use-game'
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";

import { type GameOptions } from "@/features/admin/components/create-game-form";

export default function useAdmin() {

    const resetDemo = async () => {
        const { message, success } = await reset()
        success ? toast.success(message) : toast.error(message)
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
