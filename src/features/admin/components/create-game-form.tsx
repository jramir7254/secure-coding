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
import { useCreateGame } from "../hooks/use-admin"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { toast } from "sonner"

const formSchema = z.object({
    maxTeams: z.int().min(1, "Minimun 1 team").max(30, "Maximum 30 Teams"),
    timeLimit: z.int().min(1, "Minimun 5 minutes").max(60, "Maximum 60 minutes"),
})

export type GameOptions = z.infer<typeof formSchema>


export default function CreateGameForm() {
    const createGame = useCreateGame()
    const form = useForm<GameOptions>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maxTeams: 5,
            timeLimit: 5,
        },
    })

    const onSubmit = async ({ maxTeams, timeLimit }: GameOptions) => {
        try {
            await createGame.mutateAsync({ maxTeams, timeLimit: timeLimit * 60 * 1_000 })
        } catch (error) {

        }
    }


    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-accent flex flex-col '>
            <div>
                <Controller
                    name='maxTeams'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-fit">
                            <FieldLabel htmlFor="maxTeams">Max Teams</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    className="max-w-16"
                                    id="maxTeams"
                                    type="number"
                                    value={field.value ?? ''} // Prevents React warning
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}

                                />

                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton>teams</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name='timeLimit'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-fit">
                            <FieldLabel htmlFor="timeLimit">Time Limit</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    className="max-w-16"
                                    id="timeLimit"
                                    type="number"
                                    value={field.value ?? ''} // Prevents React warning
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />

                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton>minutes</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div className="mt-auto flex">
                <Button type="submit" className="ml-auto">Create</Button>
            </div>
        </form>
    )
}


