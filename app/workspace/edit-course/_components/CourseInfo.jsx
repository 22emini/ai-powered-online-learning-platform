import { Button } from '@/components/ui/button';
import { Book, Clock, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const CourseInfo = ({ course }) => {
    const courseLayout = course?.courseJson?.course;
  return (
    <div className='   md:flex gap-5 justify-between p-5 shadow rounded-2xl'>
<div className='  flex flex-col gap-5'>
    <h2 className='font-bold text-2xl'>{courseLayout?.name}</h2>
    <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>
    <div className='grid  grid-cols-1  md:grid-cols-3 gap-3'>
      <div className=' flex gap-2 items-center p-3 rounded-lg  shadow' >
        <Clock  className=' text-blue-500'/>
        <section>
            <h2 className=' font-bold'>Duration</h2>
            <h2> 2 Hours</h2 >
        </section>
        </div>   
        <div className=' flex gap-1 items-center p-2 rounded-lg  shadow' >
        <Book  className=' text-green-500'/>
        <section>
            <h2 className=' font-bold'>Chapters</h2>
            <h2> 2 Hours</h2>
        </section>
        </div>   
        <div className=' flex  gap-1 items-center p-2  rounded-lg  shadow' >
        <TrendingUp  className=' text-red-500'/>
        <section>
            <h2 className=' font-bold'>Difficulty level  </h2>
            <h2>{courseLayout?.level}</h2>
        </section>
        </div>     
    </div> 
     <Button className={'max-w-sm mb-2'} > <Settings/> Generate Content</Button>  
</div>
<div>
    <Image src={course?.bannerImageUrl}  alt='banner image url'  width={700} height={400} className=' mt-5 aspect-auto md:mt-0 h-[240px]  object-cover rounded-2xl' />
</div>
    </div>
  )
}

export default CourseInfo
