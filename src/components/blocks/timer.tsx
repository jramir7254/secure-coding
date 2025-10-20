import React, { useState, useEffect, useRef } from "react";
import { useCurrentGame } from "@/features/game/hooks/use-game";
import { useEndGame } from "@/features/admin/hooks/use-admin";

export default function CountdownTimer() {
    const { data: currentGame, isLoading } = useCurrentGame();
    const endGame = useEndGame();
    const endTriggered = useRef(false);

    // Early returns
    if (isLoading || !currentGame) return <p>Loading timer...</p>;

    // --- Normalize times ---
    const startAtMs =
        typeof currentGame.startedAt === "string"
            ? new Date(currentGame.startedAt).getTime()
            : typeof currentGame.startedAt === "number" && currentGame.startedAt < 1e12
                ? currentGame.startedAt * 1000
                : currentGame.startedAt || 0;

    const endedAtMs =
        typeof currentGame.endedAt === "string"
            ? new Date(currentGame.endedAt).getTime()
            : typeof currentGame.endedAt === "number" && currentGame.endedAt < 1e12
                ? currentGame.endedAt * 1000
                : currentGame.endedAt || 0;

    const timeLimit = currentGame.timeLimit || 0;
    const gameStarted = !!currentGame.startedAt;
    const gameEnded = !!currentGame.endedAt;

    // --- Initialize remaining time ---
    const [remaining, setRemaining] = useState(() => {
        if (!gameStarted) return 0; // game not started
        if (gameEnded) return 0; // already ended
        return timeLimit; // initial full time when just started
    });

    useEffect(() => {
        // reset to full time when game starts
        if (gameStarted && !gameEnded) {
            setRemaining(timeLimit);
            endTriggered.current = false;
        }
    }, [gameStarted, gameEnded, timeLimit]);

    // --- Countdown logic ---
    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        const tick = () => {
            const now = Date.now();
            const elapsed = now - startAtMs;
            const newRemaining = Math.max(0, timeLimit - elapsed);

            setRemaining(newRemaining);

            if (newRemaining <= 0 && !endTriggered.current) {
                endTriggered.current = true;
                endGame.mutate();
            }
        };

        // Start ticking every second
        const interval = setInterval(tick, 1000);
        tick(); // run immediately once

        return () => clearInterval(interval);
    }, [gameStarted, gameEnded, startAtMs, timeLimit, endGame]);

    // --- Stop if game ends prematurely ---
    useEffect(() => {
        if (gameEnded && remaining > 0) {
            // freeze at current value when endedAt is set early
            const now = Date.now();
            const elapsed = endedAtMs ? endedAtMs - startAtMs : 0;
            setRemaining(Math.max(0, timeLimit - elapsed));
        }
    }, [gameEnded, endedAtMs, startAtMs, timeLimit]);

    // --- Display logic ---
    // if (!gameStarted) return <p>Waiting to start...</p>;
    // if (gameEnded) return <p>Game ended</p>;

    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        <div className="text-center text-md text-white">
            <h1 className={`${remaining < 10_000 ? "text-red-400" : "text-white"}`}>
                {minutes}:{seconds.toString().padStart(2, "0")}
            </h1>
        </div>
    );
}
