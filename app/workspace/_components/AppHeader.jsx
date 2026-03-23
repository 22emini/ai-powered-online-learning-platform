"use client"
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React, { useContext } from 'react'
import { UserProgressContext } from '@/app/context/UserProgressContext'
import { Star, Zap } from 'lucide-react'

function AppHeader({hideSiebar=false}) {
  const { level, totalXP } = useContext(UserProgressContext);

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white p-4 flex justify-between items-center shadow-sm'>
        <div className='flex items-center gap-4'>
            {!hideSiebar && <SidebarTrigger />}
            <div className='flex items-center ml-28 gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full border border-indigo-100'>
                <div className='flex items-center gap-1.5'>
                    <Star className='w-4 h-4 text-amber-500 fill-amber-500' />
                    <span className='text-sm font-bold text-indigo-700'>Level {level}</span>
                </div>
                <div className='w-px h-4 bg-indigo-200' />
                <div className='flex items-center gap-1.5'>
                    <Zap className='w-4 h-4 text-indigo-500 fill-indigo-500 bg-transparent' />
                    <span className='text-sm font-semibold text-indigo-600'>{totalXP} XP</span>
                </div>
            </div>
        </div>
        <UserButton />
    </div>
  )
}

export default AppHeader
