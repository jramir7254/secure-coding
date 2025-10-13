import { Button } from '@/components/ui/button'
import React from 'react'
import useAdmin from '../hooks/use-admin'

export default function ResetButton() {
    const { resetDemo } = useAdmin()
    return (
        <Button variant='destructive' onClick={resetDemo}>Reset</Button>
    )
}
