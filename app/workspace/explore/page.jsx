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
    const[courseList, setCourseList] = useState([])
  // keep a full copy of fetched courses to support client-side filtering
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const {user} = useUser();
  // fetch course list from API
  const GetCourseList = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await axios.get('/api/courses?courseId=0')
      const data = result.data
      // Normalize to array
      let normalized = []
      if (Array.isArray(data)) {
        normalized = data
      } else if (data == null) {
        normalized = []
      } else {
        normalized = [data]
      }
      setAllCourses(normalized)
      setCourseList(normalized)
    } catch (err) {
      console.error('Failed to fetch course list', err)
      setError(err?.message || 'Failed to fetch')
      setCourseList([])
    } finally {
      setLoading(false)
    }
  }

  // filter helper (case-insensitive) - searches courseJson.name and description and author
  const applyFilter = (term) => {
    const t = String(term || '').trim().toLowerCase()
    if (!t) {
      setCourseList(allCourses)
      return
    }
    const filtered = allCourses.filter((c) => {
      const courseJson = c?.courseJson?.course || {}
      const name = String(courseJson?.name || c?.name || '').toLowerCase()
      const desc = String(courseJson?.description || '').toLowerCase()
      const author = String(c?.author || '').toLowerCase()
      return (
        name.includes(t) ||
        desc.includes(t) ||
        author.includes(t) ||
        (c?.cid && String(c.cid).toLowerCase().includes(t))
      )
    })
    setCourseList(filtered)
  }

  // simple debounce for typing
  useEffect(() => {
    const id = setTimeout(() => applyFilter(searchTerm), 300)
    return () => clearTimeout(id)
  }, [searchTerm, allCourses])

  useEffect(() => {
    if (user) GetCourseList()
  }, [user])

  return (
    <div>
    <h2 className='font-bold text-3xl mb-6'> Explore  More Courses</h2>

    <div className='flex gap-5 max-w-md'>
    <Input
      placeholder='Search for courses...'
      value={searchTerm}
      onChange={(e)=> setSearchTerm(e.target.value)}
      onKeyDown={(e)=>{
        if(e.key === 'Enter'){
          // immediate apply on Enter
          applyFilter(searchTerm)
        }
      }}
    />
    <Button onClick={()=> applyFilter(searchTerm)} aria-label="Search"><Search /></Button>

    </div>
     
      <div className=" grid grid-col-1 md:grid-col-2 lg:grid-cols-2 xl:grid-col-3 gap-1">
        {loading && (
          // show a few skeleton course cards while loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl mt-4 overflow-hidden bg-white shadow-sm">
              <div className="relative">
                <Skeleton className="w-full aspect-video" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent pointer-events-none" aria-hidden />
                <span className="absolute top-2 left-2 inline-flex items-center gap-2 bg-white/90 text-xs text-gray-800 px-1.5 py-0.5 rounded-md shadow-sm">
                  <Skeleton className="h-3.5 w-12" />
                </span>
              </div>

              <div className="p-3 flex flex-col gap-2.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Skeleton className="h-6 w-20" />
                  </div>

                  <div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && courseList.length === 0 && (
          <div>No courses found.</div>
        )}
        {!loading && !error && courseList.map((course, index) => (
          <CourseCard course={course}  key={index} refreshCourses={GetCourseList}/>
         ))}
        </div>

      
    </div>
  )
}

export default page
