'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Search } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard'
import { Skeleton } from '@/components/ui/skeleton'

const page = () => {
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const {user} = useUser();
    
    const limit = 6;

    // fetch course list from API with search and pagination
    const GetCourseList = async (page = 1, search = '') => {
      try {
        setLoading(true)
        setError(null)
        const result = await axios.get(`/api/courses?courseId=0&page=${page}&limit=${limit}&search=${search}`)
        
        setCourseList(result.data.data)
        setTotalPages(result.data.pagination.totalPages)
        setCurrentPage(result.data.pagination.currentPage)
      } catch (err) {
        console.error('Failed to fetch course list', err)
        setError(err?.message || 'Failed to fetch')
        setCourseList([])
      } finally {
        setLoading(false)
      }
    }

    // Handles search button click or Enter key
    const handleSearch = () => {
      GetCourseList(1, searchTerm);
    }

    // Effect for handling search with debounce (optional, but let's keep it simple for now or use the button)
    useEffect(() => {
      if (user) {
        const delayDebounceFn = setTimeout(() => {
          GetCourseList(1, searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
      }
    }, [searchTerm, user]);

    return (
      <div className='mb-10'>
      <h2 className='font-bold text-3xl mb-6'> Explore More Courses</h2>

      <div className='flex gap-5 max-w-md mb-8'>
      <Input
        placeholder='Search for courses...'
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key === 'Enter'){
            handleSearch()
          }
        }}
      />
      <Button onClick={handleSearch} aria-label="Search"><Search /></Button>

      </div>
       
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading && (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm border">
                <div className="relative">
                  <Skeleton className="w-full aspect-video" />
                </div>
                <div className="p-3 flex flex-col gap-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="mt-1.5 flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          )}
          
          {!loading && error && <div className="text-red-500 col-span-full">{error}</div>}
          
          {!loading && !error && courseList?.length === 0 && (
            <div className='col-span-full text-center py-10 text-gray-500'>No courses found.</div>
          )}
          
          {!loading && !error && courseList?.map((course, index) => (
            <CourseCard course={course}  key={index} refreshCourses={() => GetCourseList(currentPage, searchTerm)}/>
           ))}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className='flex justify-center items-center gap-5 mt-10'>
            <Button 
              variant="outline" 
              disabled={currentPage <= 1}
              onClick={() => GetCourseList(currentPage - 1, searchTerm)}
            >
              Previous
            </Button>
            <span className='text-sm font-medium'>
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={currentPage >= totalPages}
              onClick={() => GetCourseList(currentPage + 1, searchTerm)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    )
}

export default page
