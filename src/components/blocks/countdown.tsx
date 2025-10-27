import { socket } from '@/lib/socket';
import { logger } from '@/lib/logger';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown() {
    const [count, setCount] = useState(3);
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        socket.on('started_timer', () => {
            logger.info('[Socket] started_timer')
            setAnimate(true);
            setCount(3)
        });

        return () => { socket.off('started_timer') };
    }, []);


    useEffect(() => {
        if (!animate) return; // only run if active

        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setAnimate(false);
                    socket.emit('start_game'); // optional
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [animate]); // ✅ only rerun when animation starts

    if (!animate) return null;

    return (
        <div className="absolute size-full z-2 bg-black/50 inset-0 grid place-items-center border-inherit">
            <AnimatePresence mode="wait">
                {count > 0 ? (
                    <motion.div
                        key={count}
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-9xl font-bold"
                    >
                        {count}
                    </motion.div>
                ) : (
                    <motion.div
                        key="go"
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-9xl font-bold text-green-400"
                    >
                        Go!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


// export default function CountdownNum() {
//     const [num, setNum] = useState(3)
//     const [animate, setAnimate] = useState(false)

//     useEffect(() => {
//         socket.on('started_timer', () => {
//             logger.info('[Socket] started_timer')
//             setAnimate(true);
//         });

//         return () => { socket.off('started_timer') };
//     }, []);


//     useEffect(() => {

//         if (!animate) return

//         let interval = setInterval(() => {
//             setNum((prev) => {
//                 if (prev - 1 <= 0) {
//                     // socket.emit('start_game');

//                     clearInterval(interval); // stop the interval
//                     setAnimate(false)
//                     setNum(3)
//                 }
//                 return prev - 1;
//             });
//         }, 1_000)

//         return () => clearInterval(interval)
//     }, [num, animate])

//     return animate ?
//         <div className='absolute size-full z-2 bg-black/50 inset-0 grid place-items-center'>
//             <motion.h1 className='animate-countdown transition-all'
//                 animate={{}}>
//                 {num}
//             </motion.h1>
//         </div>
//         :
//         null
// }
