import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type TeamSchema } from "@/features/admin/hooks/use-admin"


export default function TeamCard({ team, children, className }: { team: TeamSchema, children?: React.ReactNode, className?: string }) {

    return (
        <Card className={`${className} border-2 h-16 flex flex-row justify-between items-center px-8`}>
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="font-bold font-nunit">{team.teamName}</p>
            </div>
            {children}
        </Card>
    )
}
