import { Card, CardAction } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TeamSchema } from "../hooks/use-admin"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDeleteTeam } from "../hooks/use-admin"
import { DeleteTeamButton } from "./buttons"

export default function TeamCard({ team, place }: { team: TeamSchema, place?: number }) {
    console.log(place)

    const getPlace = (place: number | undefined) => {
        // if (!place) return "";
        if (place === 0) return 'bg-yellow-400/20 backdrop-blur-md border border-yellow-400/40 rounded-xl p-4 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 '
        if (place === 1) return 'bg-gray-300/20 backdrop-blur-md border border-gray-300/40 rounded-xl p-4 shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300'
        if (place === 2) return 'bg-amber-700/20 backdrop-blur-md border border-amber-700/40 rounded-xl p-4 shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300'
    }
    const del = useDeleteTeam()
    return (
        <Card className={`${getPlace(place)} border-2   h-16 flex flex-row justify-between items-center px-8  hover:bg-black transition-colors duration-75 cursor-pointer`}>
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="font-bold font-nunit">{team.teamName}</p>
                <p>{team?.points && team?.points}</p>
            </div>

            <div >
                <DeleteTeamButton teamId={team.id} teamName={team.teamName} />
            </div>
        </Card>
    )
}
