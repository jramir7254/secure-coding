import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { shuffleArrayEveryNewSpot } from "@/lib/utils";
import type { Question } from "../../hooks/use-question";
import { type AnswerChoices, useMultipleChoiceAttempt } from "../../hooks/use-question";
const MotionButton = motion.create(Button)


export default function OptionButton() {
    return (
        <MotionButton layout
            key={opt.value}
            // variant={selected === opt.value ? "default" : "outline"}
            onClick={() => setSelected(opt.value)}
            className={`
            transition-colors
            ${selected === opt.value ? "bg-primary" : "bg-secondary text-white"}
            ${isIncorrect && selected === opt.value
                    ? "bg-destructive text-white"
                    : ""}
          `}
            animate={
                isIncorrect && selected === opt.value
                    ? { x: [0, -8, 8, -8, 8, 0] }
                    : { x: 0 }
            }
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {opt.label}
        </MotionButton>
    )
}
