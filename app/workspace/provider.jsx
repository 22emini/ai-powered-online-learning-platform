 import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSideBar from './_components/AppSideBar'
import AppHeader from './_components/AppHeader'
 
 function WorkSpaceProvider({ children }) {
   return (
    <SidebarProvider>
        <AppSideBar />
    
         <div className='w-full'>
            <AppHeader />
            {children}</div> 
    </SidebarProvider>
    
   
   )
 }
 
 export default WorkSpaceProvider
 