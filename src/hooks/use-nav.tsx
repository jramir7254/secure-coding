import { useNavigate } from "react-router"


export default function useAppNavigation() {
    const navigate = useNavigate()

    const toAuth = () => navigate(`/`)
    const toGame = (teamName: string) => navigate(`/${teamName}`)

    return { toAuth, toGame }
}
