import React from 'react'
import { useGameLeaderboard } from '../../hooks/use-game'
import TeamCard from '@/features/admin/components/team-card'
import { motion, AnimatePresence } from "motion/react"
const MotionCard = motion.create(TeamCard)


export default function LeaderBoard() {
    const { data: leaderboard } = useGameLeaderboard()

    return (

        <motion.div layout className='space-y-3'>
            {leaderboard && leaderboard.map(
                (i, place) =>
                    <MotionCard
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        key={`${i?.teamName}-${i?.id}`}
                        team={i}
                        place={place}
                    />
            )}
        </motion.div>
    )
}
