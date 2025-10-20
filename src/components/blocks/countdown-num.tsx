import { socket } from '@/lib/socket';
import React, { useEffect, useState } from 'react'

export default function CountdownNum() {
    const [num, setNum] = useState(3)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        // Listen for incoming messages
        socket.on('started_timer', () => {
            setAnimate(true);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {

        if (!animate) return

        let interval = setInterval(() => {
            setNum((prev) => {
                if (prev - 1 <= 0) {
                    socket.emit('start_game');

                    clearInterval(interval); // stop the interval
                    setAnimate(false)
                    setNum(3)
                }
                return prev - 1;
            });
        }, 1_000)

        return () => clearInterval(interval)
    }, [num, animate])

    return animate ?
        <div className='absolute size-full z-2 bg-black/50 inset-0 grid place-items-center'>
            <h1>{num}</h1>
        </div>
        :
        null
}
