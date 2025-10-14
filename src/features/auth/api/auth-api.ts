import { BackendApi } from "@/lib/api";
import { type TeamData } from "../components/register-form";
import { jwtDecode } from 'jwt-decode';
import { tokenStore } from "./token-store";
import { type DecodedToken } from "@/hooks/use-auth";
import { isAxiosError } from "axios";

export const register = async (payload: TeamData) => {
    try {
        console.log('Register payload', payload)
        const { data } = await BackendApi.post('/auth/register', payload)
        console.log('Register response', data)
        const decoded = jwtDecode<DecodedToken>(data);
        console.debug('JWT decoded', decoded)
        tokenStore.set(data)
        return decoded


    } catch (error) {
        console.error("Error occured during reset", error)
        if (isAxiosError(error)) {
            console.error("is ax", error)

            const { message, success } = error.response?.data
            throw { message, success }
        }
        throw new Error()
        return { message: 'Error reseting database', success: false }
        console.error("Error occured during registration", error)
    }

}



export const login = async (payload: { accessCode: string }) => {
    try {
        console.log('Login payload', payload)
        const { data } = await BackendApi.post('/auth/login', payload)
        console.log('Login response', data)
        const decoded = jwtDecode<DecodedToken>(data);
        console.debug('JWT decoded', decoded)
        tokenStore.set(data)
        return decoded

    } catch (error) {
        console.error("Error occured during login", error)
    }

}
