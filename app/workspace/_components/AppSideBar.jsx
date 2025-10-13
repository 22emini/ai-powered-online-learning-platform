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
import { Book, Compass, icons, LayoutDashboard, PencilRulerIcon, UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'
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
        title:"Explore Courses",
        icon:Compass,
        path:'/workspace/explore'
    },
    {
        title:"AI Tools",
        icon:PencilRulerIcon,
        path:'/workspace/ai-tools'
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
        <Image src={'/logo.svg'}  alt='logo' width={120} height={100} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <AddNewCourseDiaglog>     <Button> Create New Course</Button></AddNewCourseDiaglog>
       
        </SidebarGroup>
        <SidebarGroup >
            <SidebarGroupContent>
                <SidebarMenu>
                    {SideBarOptions.map((item, index)=>(
                        <SidebarMenuItem key={index} >
                            <SidebarMenuButton asChild className={'p-5'}>
                                <Link href={item.path} className={`text-[17px] ${path.includes(item.path)&&'text-primary bg-purple-100'}`}> 
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
      <SidebarFooter />
    </Sidebar>

  )
}

export default AppSideBar
