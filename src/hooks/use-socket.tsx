// src/hooks/useSocket.ts
import { socket } from "../lib/socket";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { logger } from "@/lib/logger";
import type { Socket } from "socket.io-client";

const SocketContext = createContext<Socket>(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        socket.connect(); // 👈 explicitly connect

        console.log("[Socket] Connected");
        return () => {
            socket.disconnect();
            console.log("[Socket] Disconnected");
        };
    }, []);

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    );
};


export function useSocket() {
    const socket = useContext(SocketContext);
    if (!socket) logger.warn("useSocket must be used within a <SocketProvider>") //throw new Error("useSocket must be used within a <SocketProvider>");
    return socket;
}


// export function useSocket() {
//     const socketRef = useRef<Socket>(undefined);

//     useEffect(() => {
//         const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001");
//         socketRef.current = socket;

//         return () => { socket.disconnect() };
//     }, []);

//     return socketRef.current;
// }
