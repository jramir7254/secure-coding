import React from 'react'
import { useQuery } from '@tanstack/react-query'
import * as GameApi from "../api/game-api"


export const gameKeys = {
    all: ['games'] as const,
    current: ["games", "current"] as const,
    previous: ["games", "previous"] as const,
};


export function useCurrentGame() {
    return useQuery({
        queryKey: gameKeys.current,
        queryFn: GameApi.getCurrentGame,
    })
}


export function usePastGames() {
    return useQuery({
        queryKey: gameKeys.previous,
        queryFn: GameApi.getPastGames,
    })
}