import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { shuffleArrayEveryNewSpot } from "@/lib/utils";
import type { Question } from "../../hooks/use-question";
import { type AnswerChoices, useMultipleChoiceAttempt } from "../../hooks/use-question";
const MotionButton = motion.create(Button)


type ButtonProps = { value: AnswerChoices, label: string }

const options: ButtonProps[] = [
    { value: "compile", label: "Compile Time Error" },
    { value: "runtime", label: "Runtime Error" },
    { value: "logic", label: "Logic Error" },
    { value: "vulnerability", label: "Vulnerability" },
]


export function QuizButtons({ hidden, question, attemptId }: { hidden: boolean, question: Question, attemptId: number }) {
    const submitAttempt = useMultipleChoiceAttempt({ questionId: question.id, attemptId, questionType: 'multiple' })
    const [order, setOrder] = useState(options)
    const [selected, setSelected] = useState<AnswerChoices>(null)
    const [isIncorrect, setIsIncorrect] = useState(false)




    const handleSubmit = async () => {
        if (selected === null) return // nothing chosen
        try {
            await submitAttempt.mutateAsync(selected)
            console.log("✅ Correct!")
        } catch (error) {
            setIsIncorrect(true)
            setTimeout(() => {
                setIsIncorrect(false)
                setSelected(null)
                setOrder(shuffleArrayEveryNewSpot(order))
            }, 600)
        }
    }

    return (
        <div hidden={hidden} className="flex flex-col gap-2">
            {order.map((opt) => (
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
            ))}

            <Button className="w-full" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}
