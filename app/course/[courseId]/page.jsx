"use client"
import ChapterListSidebar from '@/app/course/_components/ChapterListSidebar'
import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterContent from '../_components/ChapterContent'
import { useParams } from 'next/navigation'
import axios from 'axios'

const Course = () => {
  const {courseId} = useParams();
  const [courseInfo, setCourseInfo]= useState();
  useEffect(() => {
      GetEnrolledCourseById();
    }, [])


  const GetEnrolledCourseById= async () => {
  try {
    const result = await axios.get(`/api/enroll-course?courseId=${courseId}`);
    console.log('GetEnrolledCourseById result:', result.data);
    setCourseInfo(result.data);
  } catch (error) {
    console.error('Failed to fetch enrolled course by id', error);
  }
   
  }
  return (
    <div>
      <AppHeader hideSiebar={true} />
      <div className="flex gap-10 ">
        <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent courseInfo={courseInfo} />
      </div>
    </div>
  )
}

export default Course