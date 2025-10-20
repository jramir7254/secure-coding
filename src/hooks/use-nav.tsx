import { useNavigate } from "react-router"


export default function useAppNavigation() {
    const navigate = useNavigate()

    const toAuth = () => navigate(`/`)
    const toGame = (teamName: string) => navigate(`/game`)
    const toGameLobby = (gameId: string, teamName: string) => navigate(`/game/${gameId}/waiting/team/${teamName}`)
    const toGameResults = (gameId: string, teamName: string) => navigate(`/game/${gameId}/results/team/${teamName}`)
    const toGameLive = (gameId: string, teamName: string) => navigate(`/game/${gameId}/live/team/${teamName}`)
    const toAdminPanel = () => navigate(`/admin/manage`)

    return { toAuth, toGame, toGameLobby, toGameLive, toGameResults, toAdminPanel }
}
