import useAuth from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
    const { logout } = useAuth()
    return (
        <Button size='icon-lg' variant='outline' onClick={logout}><LogOut /></Button>
    )
}
