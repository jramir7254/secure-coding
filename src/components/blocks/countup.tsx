import React, { useState, useEffect, useRef } from "react";
import { useCurrentQuestion } from "@/features/game/hooks/use-question";
import { useEndGame } from "@/features/admin/hooks/use-admin";


function CountUpTimer() {
    const [elapsed, setElapsed] = useState(0);
    const { data } = useCurrentQuestion()

    const startedAt = data?.attemptData.startedAt || 0


    useEffect(() => {
        if (!data?.attemptData.startedAt || data.attemptData.completedAt) return;

        // Convert backend UTC timestamp to milliseconds since epoch
        const startTime = new Date(startedAt.replace(" ", "T") + "Z").getTime();


        const updateElapsed = () => {
            const diffInSeconds = Math.floor((Date.now() - startTime) / 1000);
            setElapsed(diffInSeconds);
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return <div>⏱️ {formatTime(elapsed)}</div>;
}

export default CountUpTimer;