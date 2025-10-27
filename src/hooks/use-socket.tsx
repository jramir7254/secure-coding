// src/hooks/useSocket.ts
import { socket } from "../lib/socket";

import React, { createContext, useContext, useEffect } from "react";
import { logger } from "@/lib/logger";
import type { Socket } from "socket.io-client";

const SocketContext = createContext<Socket>(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        socket.connect();

        logger.info("[Socket] connected");
        return () => {
            socket.disconnect();
            logger.info("[Socket] disconnected");
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

