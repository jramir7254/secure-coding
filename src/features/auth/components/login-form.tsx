import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useNavigate } from 'react-router'
import { login } from '../api/auth-api'
import useAppNavigation from '@/hooks/use-nav'

const formSchema = z.object({
    accessCode: z.string().min(0, "Name must be at least 2 characters."),

})



export default function LoginForm() {
    const { toGame } = useAppNavigation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { accessCode: "" }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const team = await login(data)
        if (team) {
            toGame(team?.teamName)

        }
    }


    return (

        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-accent'>
            <Controller
                name='accessCode'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="accessCode">Access Code</FieldLabel>
                        <Input {...field} id="accessCode" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Button type="submit">Submit</Button>
        </form>
    )
}


