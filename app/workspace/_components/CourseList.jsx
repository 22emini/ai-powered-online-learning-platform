'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'

function CourseList() {
  const[courseList, setCourseList] = useState([])
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
      <div>
        List of courses
      </div>
}
</div>
    
      
  )
}

export default CourseList