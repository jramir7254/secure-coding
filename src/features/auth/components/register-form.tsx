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
import { register } from '../api/auth-api'
import { Switch } from '@/components/ui/switch'
import useAppNavigation from '@/hooks/use-nav'

const formSchema = z.object({
    teamName: z.string().min(0, "Name must be at least 2 characters."),
    member1: z.string().min(0, "Name must be at least 2 characters."),
    member2: z.string().min(0, "Name must be at least 2 characters."),
    member3: z.string().min(0, "Name must be at least 2 characters."),
    member4: z.string().min(0, "Name must be at least 2 characters."),
})

export type TeamData = z.infer<typeof formSchema>


export default function RegisterForm() {
    const { toGame } = useAppNavigation()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamName: "",
            member1: "",
            member2: "",
            member3: "",
            member4: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const team = await register(data)
        if (team) {
            toGame(team?.teamName)

        }
    }


    return (

        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-accent'>

            <Controller
                name='teamName'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
                        <Input {...field} id="teamName" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <FieldGroup>
                <Controller
                    name='member1'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="member1">Team Member Name #1</FieldLabel>
                            <Input {...field} id="member1" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name='member2'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="member2">Team Member Name #2</FieldLabel>
                            <Input {...field} id="member2" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name='member3'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="member3">Team Member Name #3</FieldLabel>
                            <Input {...field} id="member3" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name='member4'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="member4">Team Member Name #4</FieldLabel>
                            <Input {...field} id="member4" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit">Submit</Button>

        </form>
    )
}


