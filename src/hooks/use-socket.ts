// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
    const socketRef = useRef<Socket>(undefined);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001");
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    return socketRef.current;
}
