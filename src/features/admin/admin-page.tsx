import { Block } from '@/components/blocks'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NavLink, Outlet, useLocation } from 'react-router'


export default function AdminPage() {
    const location = useLocation().pathname.split('/')

    const currentLocation = location[location.length - 1]

    return (
        <Block className='flex-1  gap-5 m-5'>
            <Tabs defaultValue={currentLocation} className='px-7 pt-5'>
                <TabsList>
                    <TabsTrigger value='games' asChild>
                        <NavLink to='games'>Games</NavLink>
                    </TabsTrigger>
                    <TabsTrigger value='questions' asChild>
                        <NavLink to='questions'>Questions</NavLink>
                    </TabsTrigger>
                    <TabsTrigger value='teams' asChild>
                        <NavLink to='teams'>Teams</NavLink>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <Outlet />
        </Block>
    )
}