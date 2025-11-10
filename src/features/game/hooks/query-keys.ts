
export const gameKeys = {
    all: ['games'] as const,
    one: (gameId: number) => [...gameKeys.all, "one", gameId] as const,
    current: {
        base: () => [...gameKeys.all, "current"] as const,
        teams: () => [...gameKeys.all, "current", "teams"] as const,
        leaderboard: () => [...gameKeys.all, "current", "leaderboard"] as const,
    },
    results: (teamId: string) => [...gameKeys.all, 'results', teamId] as const,
    previous: () => [...gameKeys.all, "previous"] as const,
    leaderboard: () => [...gameKeys.all, "leaderboard"] as const,
};



export const questionKeys = {
    root: ['questions'] as const,
    list: {
        base: () => [...questionKeys.root, "list"] as const,
        attempts: {
            team: (teamId: string) => [...questionKeys.list.base(), "attempts", "teams", teamId] as const,
        }
    },
    current: () => [...questionKeys.root, "current"] as const,
    previous: () => [...questionKeys.root, "previous"] as const,

    detail: {
        root: () => [...questionKeys.root, "detail"] as const,
        read: (questionId: string) => [...questionKeys.root, "detail", questionId] as const,
    },
};