import React from 'react'
import { reset } from '../api/admin-api'
import { toast } from "sonner"

export default function useAdmin() {

    const resetDemo = async () => {
        const { message, success } = await reset()
        success ? toast.success(message) : toast.error(message)
    }

    return { resetDemo }
}
