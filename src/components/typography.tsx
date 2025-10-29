import React from 'react'

export function Heading({ children, ...props }: { children: string }) {
    return (
        <h2 {...props} className='font-nunit font-bold text-2xl mb-5'>
            {children}
        </h2>
    )
}
