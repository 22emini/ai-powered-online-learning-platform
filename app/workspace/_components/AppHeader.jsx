import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader({hideSiebar=false}) {
  return (
    <div className='fixed top-0 left-0 right-0 z-50  bg-white p-4 flex justify-between items-center shadow-sm'>
        {!hideSiebar&& <SidebarTrigger />}
    <UserButton />
    </div>
  )
}

export default AppHeader
