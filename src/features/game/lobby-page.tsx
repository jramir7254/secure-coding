import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DevBlock } from '@/components/dev-blocks'
import { socket } from '@/lib/socket'


export default function LobbyPage() {
    const [num, setNum] = useState(3)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receive_message', (data) => {
            console.log('here2')
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
                    clearInterval(interval); // stop the interval
                    setAnimate(false)
                    setNum(3)
                }
                return prev - 1;
            });
        }, 1_000)

        return () => clearInterval(interval)
    }, [num, animate])

    return (
        <DevBlock className='size-full'>
            LobbyPage
            {animate ? <h1>{num}</h1> : null}
        </DevBlock>
    )
}
