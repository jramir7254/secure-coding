import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL

// create and export ONE shared connection
export const socket = io('https://secure-coding.epcc.acm.org', {
    path: "/ws/",
    transports: ["websocket"],

    autoConnect: false, // optional: control when to connect
});
