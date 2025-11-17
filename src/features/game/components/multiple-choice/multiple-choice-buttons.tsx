import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { shuffleArrayEveryNewSpot } from "@/lib/utils";
import type { GetCurrentQuestionResponse, Question } from "../../types/questions";
import { type AnswerChoices, type GetQuestionResponse, useMultipleChoiceAttempt } from "../../hooks/use-question";
import type { QuestionAttempt } from "../../types/questions";

import CooldownButton from "@/components/blocks/cooldown-button";
import { logger } from "@/lib/logger";

const MotionButton = motion.create(Button);

type ButtonProps = { value: AnswerChoices; label: string };

const options: ButtonProps[] = [
    { value: "compile", label: "Compile Time Error" },
    { value: "runtime", label: "Runtime Error" },
    { value: "logic", label: "Logic Error" },
    { value: "vulnerability", label: "Vulnerability" },
];

export function QuizButtons({ data }: { data: GetCurrentQuestionResponse }) {
    const submitAttempt = useMultipleChoiceAttempt({ ...data });
    const [order, setOrder] = useState(options);
    const [selected, setSelected] = useState<AnswerChoices[]>([]);
    const [isIncorrect, setIsIncorrect] = useState(false);

    if (!data) return
    const shouldHide = data.questionData?.type !== 'mcq'


    const toggleSelect = (value: AnswerChoices) => {
        setSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    logger.debug(`[selected.length]: ${selected.length}`)

    const handleSubmit = async () => {
        if (selected.length === 0) return; // nothing chosen
        try {
            await submitAttempt.mutateAsync(selected);
            console.log("✅ Correct!");
            setSelected([]);


        } catch (error) {
            setIsIncorrect(true);
            setTimeout(() => {
                setIsIncorrect(false);
                setSelected([]);
                setOrder(shuffleArrayEveryNewSpot(order));
            }, 600);
        }
    };

    return (
        <div hidden={shouldHide} className="flex flex-col items-center gap-2 py-5">
            {order.map((opt) => {
                const isActive = selected.includes(opt.value);
                return (
                    <MotionButton
                        layout
                        key={opt.value}
                        onClick={() => toggleSelect(opt.value)}
                        className={`
                            w-[75%]
              transition-colors
              ${isActive ? "bg-primary text-white" : "bg-secondary text-white"}
              ${isIncorrect && isActive ? "bg-destructive text-white" : ""}
              ${isIncorrect ? "text-transparent" : "text-white"}
            `}
                        animate={
                            isIncorrect && isActive
                                ? { x: [0, -8, 8, -8, 8, 0] }
                                : { x: 0 }
                        }
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {opt.label}
                    </MotionButton>
                );
            })}



            <CooldownButton disabled={selected.length === 0} className=" w-[75%] mt-5" action={handleSubmit} >
                Submit
            </CooldownButton>
        </div>
    );
}
