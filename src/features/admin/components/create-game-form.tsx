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
import { Switch } from '@/components/ui/switch'
import useAppNavigation from '@/hooks/use-nav'
import { useCreateGame } from "@/features/auth/hooks/use-admin"

const formSchema = z.object({
    maxTeams: z.int().min(5, "Minimun 5 teams").max(30, "Maximum 30 Teams"),
    timeLimit: z.string().min(0, "Name must be at least 2 characters."),
})

export type GameOptions = z.infer<typeof formSchema>


export default function CreateGameForm() {
    const createGame = useCreateGame()
    const form = useForm<GameOptions>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maxTeams: 5,
            timeLimit: "30 min",
        },
    })

    const onSubmit = async (data: GameOptions) => {
        await createGame.mutateAsync(data)
    }


    return (

        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-accent'>

            <Controller
                name='maxTeams'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="maxTeams">Max Teams</FieldLabel>
                        <Input
                            {...field}
                            id="maxTeams"
                            type="number"
                            value={field.value ?? ''} // Prevents React warning
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name='timeLimit'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="timeLimit">Time Limit</FieldLabel>
                        <Input {...field} id="timeLimit" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit">Submit</Button>

        </form>
    )
}


