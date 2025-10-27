import { useCurrentGameLeaderboard } from '../../hooks/use-game'
import TeamCard from '@/components/blocks/team-card'
import { motion, AnimatePresence } from "motion/react"


export default function LeaderBoard() {
    const { data: leaderboard } = useCurrentGameLeaderboard()

    return (
        <motion.div layout className="space-y-3">
            {leaderboard?.sort((a, b) => b.points - a.points).map((i, place) => (
                <motion.div key={`leaderboard-${i.teamId}`} layout transition={{ duration: 0.4, ease: "easeInOut" }}>
                    <TeamCard
                        team={{ id: i.teamId, points: i.points, teamName: i.teamName }}
                    >
                        <p>{i.points}</p>
                    </TeamCard>
                </motion.div>
            ))}
        </motion.div>
    )
}

