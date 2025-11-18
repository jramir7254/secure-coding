import { useState, useEffect, useRef } from "react";
import { Button } from "../ui";
import { Spinner } from "../ui/spinner";
import { type ShadCnButtonProps } from "../ui";
import { logger } from "@/lib/logger";


type CooldownButtonProps = ShadCnButtonProps & {
    action: () => Promise<any>
    duration?: number
}

export default function CooldownButton({
    action,
    duration = 10,
    disabled,
    children,
    ...props
}: CooldownButtonProps) {

    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Restore cooldown from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("cooldown");
        if (!saved) return;

        const endsAt = parseInt(saved, 10);
        const now = Date.now();
        const diff = Math.ceil((endsAt - now) / 1000);

        if (diff > 0) {
            setCooldown(diff);
        } else {
            localStorage.removeItem("cooldown");
        }
    }, []);

    // Countdown logic
    useEffect(() => {
        if (cooldown === 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    localStorage.removeItem("cooldownEndsAt");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [cooldown]);



    const handleClick = async () => {
        if (cooldown > 0 || loading) return;

        setLoading(true);

        try {
            await action();
        } finally {
            setLoading(false);

            setCooldown(duration);
            localStorage.setItem(
                "cooldown",
                String(Date.now() + duration * 1000)
            );
        }
    };

    // logger.debug(`[disabled]: ${disabled}`)


    return (
        <Button
            onClick={handleClick}
            disabled={cooldown > 0 || loading || disabled}
            style={{
                opacity: cooldown > 0 || loading ? 0.6 : ''
            }}
            {...props}
        >
            <span className="inline-flex items-center gap-2">
                {cooldown > 0 && <span className="inline-flex items-center"><Spinner />{`${cooldown}s`}</span>}
                {children}
            </span>
        </Button>
    );
}
