import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useAppNavigation from "@/hooks/use-nav";
import { toast } from "sonner";
import { useAuth } from "../hooks/use-auth";

const loginSchema = z.object({
    accessCode: z.string().min(3, "Access code must be 6 characters."),
});

const registerSchema = z.object({
    teamName: z.string().min(5, "Team name must be at least 5 characters."),
});

export default function AuthForm() {
    const { login, register } = useAuth()
    const { toGame, toAdminPanel } = useAppNavigation();
    const [isRegister, setIsRegister] = useState(false);

    // 🧩 Create form with dynamic resolver
    const form = useForm({
        resolver: zodResolver(isRegister ? registerSchema : loginSchema),
        defaultValues: { accessCode: "", teamName: "" },
    });

    // 🧩 Reset form + update resolver when mode changes
    useEffect(() => {
        form.reset();
    }, [isRegister]);

    const onSubmit = async (data: any) => {
        try {
            let team;
            if (isRegister) {
                team = await register(data);
            } else {
                team = await login(data);
            }
            if (team) {

                if (team.isAdmin) {
                    toAdminPanel()
                    return
                }
                toGame(team.teamName);
            }
        } catch (error: any) {
            toast.error(error.message)
            form.setError('root.serverError', {
                type: 'manual',
                message: error.message,
            });
        }

    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-accent h-full border rounded-2xl p-6 space-y-6"
        >
            {/* Access Code (sRegister Mode) */}
            <div className={!isRegister ? "block" : "hidden"}>
                <Controller
                    name="accessCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="accessCode">Access Code</FieldLabel>
                            <InputOTP
                                id="accessCode"
                                maxLength={6}
                                value={field.value}
                                onChange={field.onChange}
                            >
                                <InputOTPGroup>
                                    {[0, 1, 2].map((i) => (
                                        <InputOTPSlot key={i} index={i} />
                                    ))}
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    {[3, 4, 5].map((i) => (
                                        <InputOTPSlot key={i} index={i} />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            {/* Team Name (Login Mode) */}
            <div className={isRegister ? "block" : "hidden"}>
                <Controller
                    name="teamName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
                            <Input {...field} id="teamName" />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            {form.formState.errors.root?.serverError && (
                <p className="text-destructive animate-shake">{form.formState.errors.root.serverError.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
                {isRegister ? "Register" : "Login"}
            </Button>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-medium">Login</span>
                <Switch
                    checked={isRegister}
                    onCheckedChange={(checked) => setIsRegister(checked)}
                />
                <span className="text-sm font-medium">Register</span>
            </div>
        </form>
    );
}
