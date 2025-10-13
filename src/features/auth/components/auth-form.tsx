import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import RegisterForm from './register-form'
import LoginForm from './login-form'



export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(true)

    return (

        <div>
            {isRegister ? <RegisterForm /> : <LoginForm />}
            <Switch checked={isRegister} onClick={() => setIsRegister(!isRegister)} />
        </div>
    )
}

