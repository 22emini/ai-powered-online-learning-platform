'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import CourseCard from './CourseCard'

function CourseList() {
  const[courseList, setCourseList] = useState([])
  const {user} = useUser();
  useEffect(()=>{
    user&&GetCourseList()

  },[user])
   const GetCourseList = async ()=>{
    const result = await axios.get('/api/courses');
    console.log(result.data)
    setCourseList(result.data)
   }
  return (
    <div className='mt-10'>

      <h2 className='font-bold text-3xl'>Course List</h2>
      {courseList?.length==0 ? 
      <div className='flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary '>

<Image src="/online-education.png" width={80} height={80} alt="No courses" />
<h2 className=' my-2 text-xl  font-bold'> Look like you  haven't any  courses yet  </h2>
<AddNewCourseDiaglog>
  <Button> + Create yout first Courses </Button>
</AddNewCourseDiaglog>

      </div>:
      <div className=" grid grid-col-1 md:grid-col-2 lg:grid-cols-2 xl:grid-col-3 gap-2">
       {courseList?.map((course, index) => (
        <CourseCard course={course}  key={index}/>
       ))}
      </div>
}
</div>
    
      
  )
}

export default CourseList