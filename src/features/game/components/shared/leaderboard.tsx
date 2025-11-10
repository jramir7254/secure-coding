import { useCurrentGameLeaderboard } from '../../hooks/use-game'
import TeamCard from '@/components/blocks/team-card'
import { motion } from "motion/react"
import { useTeam } from '@/features/auth/hooks/use-team'


export default function LeaderBoard() {
    const { data: leaderboard } = useCurrentGameLeaderboard()
    const { data: team } = useTeam()

    const getPlace = (place: number | undefined) => {
        // if (!place) return "";
        if (place === 0) return 'bg-yellow-200/20 backdrop-blur-md border border-yellow-200/60 rounded-xl p-4 shadow-lg  '
        if (place === 1) return 'bg-gray-300/20 backdrop-blur-md border border-gray-300/40 rounded-xl p-4 shadow-md '
        if (place === 2) return 'bg-amber-400/20 backdrop-blur-md border border-amber-500/40 rounded-xl p-4 shadow-sm '
    }

    return (
        <motion.div layout className="space-y-3">
            {leaderboard?.sort((a, b) => b.totalPoints - a.totalPoints).map((i, place) => (
                <motion.div key={`leaderboard-${i.teamId}`} layout transition={{ duration: 0.4, ease: "easeInOut" }}>
                    <TeamCard
                        className={getPlace(place)}
                        team={{ id: i.teamId, totalPoints: i.totalPoints, teamName: i.teamName }}
                    >
                        <p>{i.totalPoints}</p>
                    </TeamCard>
                </motion.div>
            ))}
        </motion.div>
    )
}

