'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddNewCourseDiaglog from './AddNewCourseDiaglog'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import CourseCard from './CourseCard'

function CourseList() {
  const [courseList, setCourseList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const limit = 6;

  const {user} = useUser();
  
  useEffect(()=>{
    user && GetCourseList(1)
  },[user])

   const GetCourseList = async (page = 1)=>{
    setLoading(true);
    try {
      const result = await axios.get('/api/courses?page=' + page + '&limit=' + limit);
      setCourseList(result.data.data)
      setTotalPages(result.data.pagination.totalPages)
      setCurrentPage(result.data.pagination.currentPage)
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
   }

  return (
    <div className='mt-10 mb-10'>
      <h2 className='font-bold text-xl'>Course List</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
           {[1,2,3].map((item, index) => (
             <div key={index} className='w-full h-[200px] bg-slate-200 animate-pulse rounded-xl'></div>
           ))}
        </div>
      ) : courseList?.length == 0 ? 
      <div className='flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary '>
        <Image src="/new.png" width={80} height={80} alt="No courses"  className='rounded-full'/>
        <h2 className=' my-2 text-xl  font-bold'> Look like you haven't Registered any courses yet </h2>
        <AddNewCourseDiaglog>
          <Button> + Create your first Courses </Button>
        </AddNewCourseDiaglog>
      </div> :
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {courseList?.map((course, index) => (
            <CourseCard course={course}  key={index} refreshCourses={() => GetCourseList(currentPage)}/>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-5 mt-10'>
            <Button 
              variant="outline" 
              disabled={currentPage <= 1}
              onClick={() => GetCourseList(currentPage - 1)}
            >
              Previous
            </Button>
            <span className='text-sm font-medium'>
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={currentPage >= totalPages}
              onClick={() => GetCourseList(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </>
    }
    </div>
  )
}

export default CourseList