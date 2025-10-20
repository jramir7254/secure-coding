import React from 'react'


export default function OutputTerminal({ hidden, output }: { hidden: boolean, output: string }) {

    return (
        <div hidden={hidden} className='font-nunit'>out: {output}</div>
    )
}
