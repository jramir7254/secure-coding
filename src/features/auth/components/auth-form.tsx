import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Input, Button, Switch } from "@/components/ui/";

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
    const [isLogin, setIsLogin] = useState(false);


    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: { accessCode: "", teamName: "" },
    });


    useEffect(() => {
        form.reset();
    }, [isLogin]);


    const onSubmit = async (data: any) => {
        try {
            let team;
            if (isLogin) {
                team = await login(data);
            } else {
                team = await register(data);
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

    const hasRootError = form.formState.errors.root?.serverError

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center rounded-2xl p-6 space-y-6"
        >

            {/* Access Code (sRegister Mode) */}
            <div className={isLogin ? "block" : "hidden"}>
                <Controller
                    name="accessCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className={hasRootError ? 'text-destructive animate-shake' : ''}>
                            <FieldLabel htmlFor="accessCode">Access Code</FieldLabel>
                            <InputOTP
                                id="accessCode"
                                maxLength={6}
                                value={field.value}
                                onChange={field.onChange}
                            >
                                <InputOTPGroup>
                                    {[0, 1, 2].map((i) => (
                                        <InputOTPSlot className="!bg-accent" key={i} index={i} />
                                    ))}
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    {[3, 4, 5].map((i) => (
                                        <InputOTPSlot className="!bg-accent" key={i} index={i} />
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
            <div className={!isLogin ? "block" : "hidden"}>
                <Controller
                    name="teamName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className={hasRootError ? 'text-destructive animate-shake' : ''}>
                            <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
                            <Input {...field} id="teamName" className="!bg-accent" />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>



            {/* Submit Button */}
            <Button type="submit" className="hidden">
                {isLogin ? "Login" : "Register"}
            </Button>


            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-medium">Register</span>
                <Switch
                    checked={isLogin}
                    onCheckedChange={(checked) => setIsLogin(checked)}
                />
                <span className="text-sm font-medium">Login</span>
            </div>
        </form>
    );
}
