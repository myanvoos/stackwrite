import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import { Icon, Icons } from '@/components/Icons'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import CollabRequestSidebarOption from '@/components/CollabRequestSidebarOption'
import { fetchRedis } from '@/helpers/redis'
import { getStoriesByUserId } from '@/helpers/get-stories-by-user-id'
import SidebarStoryList from '@/components/SidebarStoryList'


interface LayoutProps {
    children: ReactNode
}

interface SidebarOption {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add a new collaborator',
        href: '/dashboard/add/collaborator',
        Icon: 'UserPlus'
    },
    {
        id: 2,
        name: 'Add a new story',
        href: '/dashboard/add/story',
        Icon: 'NotebookPen'
    }
]

const Layout = async ({ children }: LayoutProps) => {
    // Get session information
    const session = await getServerSession(authOptions)
    
    if (!session) notFound()

    const stories = await getStoriesByUserId(session.user.id) 

    const unseenRequestCount = (
        await fetchRedis(
            'smembers', 
            `user:${session.user.id}:incoming_collab_requests`
        ) as User[]
    ).length
    
    return (
        <div className='w-full flex h-screen'>
            <div className='flex h-full w-3/4 max-w-xs grow-1 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                    <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                        <Icons.Logo className='h-8 w-auto text-indigo-600'></Icons.Logo>
                    </Link>


                    {stories.length > 0 ? (
                        <div className='text-sm font-semibold leading-6 text-gray-400'>
                            Your stories
                        </div>
                    ) : null }

                    <nav className='flex flex-1 flex-col'>
                        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                            <li>
                                <SidebarStoryList stories={stories} sessionId={session.user.id}/>
                            
                            </li>
                            <li>
                                <div className='text-sm font-semibold leading-6 text-gray-400'>
                                    Overview
                                </div>

                                <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                    {sidebarOptions.map((option) => {
                                        const Icon = Icons[option.Icon]
                                        return (
                                            <li key={option.id}>
                                                <Link 
                                                    href={option.href} 
                                                    className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                    <span className='text-gray-400 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-medium bg-white'>
                                                        <Icon className='h-4 w-4' />
                                                    </span>

                                                    <span className='truncate'>{option.name}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                    <li>
                                        <CollabRequestSidebarOption 
                                            sessionId={session.user.id} 
                                            initialUnseenRequestCount={unseenRequestCount}
                                        />
                                    </li>
                                </ul>
                            </li>


                            <li className='-mx-6 mt-auto mb-4 flex items-center'>
                                <div className='flex flex-1 items-center gap-x-4 px-6 ;py-3 text-sm font-semibold leading-6 text-gray-900'>
                                    <div className='relative h-8 w-8 bg-gray-50'>
                                        <Image
                                            fill
                                            referrerPolicy='no-referrer'
                                            className='rounded-full'
                                            src={session.user.image || ''}
                                            alt='Your profile picture'
                                        />
                                    </div>
                                    
                                    
                                    <span className='sr-only'>Your profile</span>
                                    <div className='flex flex-col'>
                                        <span aria-hidden='true'>{session.user.name}</span>
                                        <span className='text-xs text-zinc-400' aria-hidden="true">
                                            {session.user.email}
                                        </span>
                                    </div>
                                </div>
                                
                                <SignOutButton className='h-full aspect-square mr-2' />
                            </li>
                        </ul>
                    </nav>
                </div>
            {children}
        </div>
    )
}

export default Layout