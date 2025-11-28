 import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSideBar from './_components/AppSideBar'
import AppHeader from './_components/AppHeader'
import WelcomeBanner from './_components/WelcomeBanner'
 
 function WorkSpaceProvider({ children }) {
   return (
    <SidebarProvider>
        <AppSideBar />
         <div className='w-full'>
            <AppHeader />
            <div className='p-10 mt-14 '>
           
                  {children}
            </div>
        </div> 
    </SidebarProvider>
    
   
   )
 }
 
 export default WorkSpaceProvider
 