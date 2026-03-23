'use client'
import React, { useContext } from 'react'
import { UserProgressContext } from '@/app/context/UserProgressContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Book, ChartBar, Compass, LayoutDashboard, LogOutIcon, PencilRulerIcon, UserCircle2Icon, Star, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'
import { SignOutButton } from '@clerk/nextjs'
function AppSideBar() {
    const { totalXP } = useContext(UserProgressContext);
    const SideBarOptions = [{
        title:"Dashboard",
        icon:LayoutDashboard,
        path:'/workspace'
    },
    {
        title:"My Learning",
        icon:Book,
        path:'/workspace/my-learning'
    },
    {
        title:"Analytics",
        icon:ChartBar,
        path:'/workspace/analytics'
    },
    {
        title:"Explore Courses",
        icon:Compass,
        path:'/workspace/explore'
    },
    {
        title:"AI Summarizer ",
        icon:PencilRulerIcon,
        path:'/workspace/ai-summarizer'
    },
    {
        title:"Profile",
        icon:UserCircle2Icon,
        path:'/workspace/profile'
    },
]
const path = usePathname();
  return (
   
    <Sidebar className={''}>
      <SidebarHeader >
        <div className=' '>
        {/* <Image src={'/logo2.png'} alt='logo' width={50} height={50} className="rounded-full bg-[#0A1F3F]" />
            
            <span className=" font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">QuorifyAI</span> */}
        </div>
     
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <AddNewCourseDiaglog >     <Button className=" mt-12"> Create New Course</Button></AddNewCourseDiaglog>
       
        </SidebarGroup>
        <SidebarGroup >
            <SidebarGroupContent>
                <SidebarMenu>
                    {SideBarOptions.map((item, index)=>(
                        <SidebarMenuItem key={index} >
                            <SidebarMenuButton asChild className={'p-5'}>
                                <Link href={item.path} className={`text-[17px] ${path === item.path && 'text-[#1B3B6E] bg-purple-100'}`}> 
                                <item.icon className='h-7 w-7'/>
                                <span  className=''>{item.title}</span>
                                </Link>
                             
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                     </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='px-4 pb-4'>
        <div className='mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg overflow-hidden relative'>
             <div className='absolute -right-2 -bottom-2 opacity-10'>
                <Target className='w-20 h-20' />
             </div>
             <div className='flex items-center gap-2 mb-2'>
                <Star className='w-4 h-4 fill-white' />
                <span className='text-[13px] font-bold uppercase tracking-wider'>Next Level</span>
             </div>
             <div className='flex justify-between items-end mb-1.5'>
                <span className='text-xs opacity-80'>{totalXP % 1000} / 1000 XP</span>
                <span className='text-xs font-bold'>{Math.floor((totalXP % 1000) / 10)}%</span>
             </div>
             <div className='w-full h-1.5 bg-white/20 rounded-full overflow-hidden'>
                <div 
                    className='h-full bg-white rounded-full transition-all duration-500' 
                    style={{ width: `${(totalXP % 1000) / 10}%` }}
                />
             </div>
             <p className='text-[10px] mt-2 opacity-70 font-medium'>Complete {Math.ceil((1000 - (totalXP % 1000)) / 100)} more missions to level up!</p>
        </div>
        <span className='justify-start'>
            <SignOutButton>
                <div className='flex items-center gap-2 cursor-pointer hover:text-red-500 font-medium transition-colors'> 
                    <LogOutIcon className='h-6 w-6'/>Logout
                </div>
            </SignOutButton>
        </span>
      </SidebarFooter>
    </Sidebar>

  )
}

export default AppSideBar
