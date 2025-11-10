export interface GameSchema {
    id: string
    maxTeams: number
    isActive: boolean
    timeLimit: number
    startedAt: string | null
    endedAt: string | null
    teamsPlayed?: number | null
}
