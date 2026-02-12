'use client'
import React, { use } from 'react'
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
import { Book, ChartBar, Compass, icons, LayoutDashboard, LogOutIcon, PencilRulerIcon, UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'
import { SignOutButton } from '@clerk/nextjs'
function AppSideBar() {
    const  SideBarOptions=[{
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
                                <Link href={item.path} className={`text-[17px] ${path.includes(item.path)&&'text-[#1B3B6E] bg-purple-100'}`}> 
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
      <SidebarFooter>
        <span className=' justify-start'><SignOutButton ><div className='flex items-center gap-2 cursor-pointer hover:text-red-500 '> <LogOutIcon className='h-7 w-7'/>Logout</div></SignOutButton></span>
      </SidebarFooter>
    </Sidebar>

  )
}

export default AppSideBar
