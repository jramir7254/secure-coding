import React from 'react'

import { Card, } from './ui/card'

type BlockProps = {
    children: React.ReactNode,
    className?: string
}

export function DevBlock({ children, className }: BlockProps) {
    return (
        <div className={`bg-accent border overflow-hidden rounded-md ${className}`}>
            {children}
        </div>
    )
}

export function DevCard({ children, className }: BlockProps) {

    return (
        <Card className={className}>
            {children}
        </Card>
    )
}
