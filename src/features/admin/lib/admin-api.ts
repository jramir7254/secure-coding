import { BackendApi } from "@/lib/api";
import { isAxiosError } from "axios";

export const reset = async (): Promise<{ success: boolean, message: string }> => {
    try {
        console.log('Reset payload', null)
        const { data } = await BackendApi.post<{ success: boolean, message: string }>('/admin/reset')
        console.log('Reset response', data)
        if (!data) return { message: '', success: false }
        return data
    } catch (error) {
        console.error("Error occured during reset", error)
        if (isAxiosError(error)) {
            const { message, success } = error.response?.data
            return { message, success }
        }
        return { message: 'Error reseting database', success: false }
    }
}
