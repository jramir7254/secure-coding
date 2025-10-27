import React, { useState } from 'react'
import { motion } from 'motion/react'
import { shuffleArrayEveryNewSpot } from '@/lib/utils'
import { Block } from '@/components/blocks'
import { Button } from '@/components/ui'

export default function HowToPlayPage() {
    const [arr, setArr] = useState([1, 2, 3, 4, 5])



    return (
        <Block className='size-full'>
            <Button onClick={() => setArr(shuffleArrayEveryNewSpot(arr))}>Shuffle</Button>
            <motion.div layout>
                {arr.map(i => <motion.p layout transition={{ duration: 0.4, ease: "easeInOut" }}
                    key={`test-${i}`}>{i}</motion.p>)}
            </motion.div>
        </Block>
    )
}
