import { BackendApi } from "@/lib/api";
import { isAxiosError } from "axios";

interface GameSchema {
    id: string
    maxTeams: number
    isCurrent: boolean
    timeLimit: number
    startedAt: number | null
    endedAt: number | null
}

import { type GameOptions } from "@/features/admin/components/create-game-form";

export const getCurrentGame = async (): Promise<GameSchema | null> => {
    try {
        console.log('Get current game payload', null)
        const { data } = await BackendApi.get<GameSchema>('/games/current')
        console.log('Get current game response', data)
        // if (!data) return { message: '', success: false }
        return data
    } catch (error) {
        console.error("Error occured during getting current game", error)
        if (isAxiosError(error)) {
            const { message, success } = error.response?.data
            // return { message, success }
        }
        throw new Error("err")
    }
}


export const getPastGames = async (): Promise<GameSchema[]> => {
    try {
        const { data } = await BackendApi.get<GameSchema[]>('/games/past')
        console.log('Get current game response', data)
        if (!data) return []
        return data
    } catch (error) {
        console.error("Error occured during getting current game", error)
        if (isAxiosError(error)) {
            const { message, success } = error.response?.data
        }
        throw new Error("err")
    }
}


export const createGame = async (payload: GameOptions): Promise<GameSchema | null> => {
    try {
        const { data } = await BackendApi.post<GameSchema>('/games/create', payload)
        if (!data) return null
        return data
    } catch (error) {
        console.error("Error occured during getting current game", error)
        if (isAxiosError(error)) {
            const { message, success } = error.response?.data
        }
        throw new Error("err")
    }
}
