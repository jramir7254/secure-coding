import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useQuestionContext, type QuestionVariant } from '@/context/question-context';
import { shuffleArrayEveryNewSpot } from "@/lib/utils";
const MotionButton = motion.create(Button)

const options = [
    { value: "compile", label: "Compile Time Error" },
    { value: "runtime", label: "Runtime Error" },
    { value: "logic", label: "Logic Error" },
    { value: "vulnerability", label: "Vulnerability" },
]


export function QuizButtons({ setType }: { setType: React.Dispatch<React.SetStateAction<QuestionVariant>> }) {
    const [order, setOrder] = useState(options)
    const [selected, setSelected] = useState("")
    const [isIncorrect, setIsIncorrect] = useState(false)
    const { question, setReadOnly } = useQuestionContext()




    const handleSubmit = () => {
        if (selected === "") return // nothing chosen
        if (selected !== question.answer) {
            // wrong — trigger shake + red
            setIsIncorrect(true)
            setTimeout(() => {
                setIsIncorrect(false)
                setSelected("")
                setOrder(shuffleArrayEveryNewSpot(order))
            }, 600)
        } else {
            // correct — you can trigger a success animation later
            console.log("✅ Correct!")
            setReadOnly(false)
            setType('coding')
        }
    }

    return (
        <div className="flex flex-col gap-2">
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
