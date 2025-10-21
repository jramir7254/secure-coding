import React from 'react'

import { Card, } from './ui/card'

type BlockProps = {
    children: React.ReactNode,
    className?: string
    direction?: 'row' | 'col'
    centered?: boolean
} & React.ComponentProps<'div'>

export function DevBlock({ children, className }: BlockProps) {
    return (
        <div className={`bg-accent border overflow-hidden rounded-md ${className}`}>
            {children}
        </div>
    )
}


export function Block({ children, className }: BlockProps) {
    return (
        <div className={`bg-accent border overflow-hidden rounded-md ${className}`}>
            {children}
        </div>
    )
}

export function Flex({ children, className, direction = 'col', centered, ...props }: BlockProps) {
    return (
        <div className={`flex flex-${direction} ${centered ? 'items-center justify-center' : ''} ${className}`} {...props}>
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



const theme = {
    bgStart: "#0b1022",
    bgEnd: "#17122b",
    neon: "#a855f7",
    neonSoft: "#8b5cf6",
    cyan: "#22d3ee",
    success: "#10b981",
    danger: "#ef4444",
    text: "#e5e7eb",
    subtext: "#94a3b8",
};



export function AnimatedGradient() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 w-full h-full"
            style={{
                background: `radial-gradient(1200px 800px at 20% 0%, ${theme.neon}11, transparent 60%), radial-gradient(1000px 600px at 80% 20%, ${theme.cyan}0f, transparent 60%), linear-gradient(120deg, ${theme.bgStart}, ${theme.bgEnd})`,
                animation: "bg-pan 18s linear infinite",
            }}
        >
            <style>{`
        @keyframes bg-pan { 0%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(20deg)} 100%{filter:hue-rotate(0deg)} }
      `}</style>
        </div>
    );
}

export function GridOverlay() {
    const gridColor = "rgba(175, 163, 50, 0.3)";
    return (
        <svg className="pointer-events-none absolute inset-0 z-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke={gridColor} strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    );
}
