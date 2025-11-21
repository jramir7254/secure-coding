import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL

// create and export ONE shared connection
export const socket = io(URL, {
    path: '/socket.io/',
    autoConnect: false, // optional: control when to connect
});
