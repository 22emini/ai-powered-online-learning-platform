"use client"
import ChapterListSidebar from '@/app/course/_components/ChapterListSidebar'
import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterContent from '../_components/ChapterContent'
import { useParams } from 'next/navigation'

import AITutorChatbot from '@/components/ChatBot'

const Course = () => {
  const {courseId} = useParams();
  const [courseInfo, setCourseInfo]= useState();
  useEffect(() => {
      GetEnrolledCourseById();
    }, [])


  const GetEnrolledCourseById= async () => {
  try {
    const response = await fetch(`/api/enroll-course?courseId=${courseId}`);
    const data = await response.json();
    console.log('GetEnrolledCourseById result:', data);
    setCourseInfo(data);
  } catch (error) {
    console.error('Failed to fetch enrolled course by id', error);
  }
   
  }
  return (
    <div>
      <AppHeader hideSiebar={true} />
      <div className="flex gap-10 ">
        <ChapterListSidebar courseInfo={courseInfo} />
          <AITutorChatbot courseId={courseId} />
        <ChapterContent courseInfo={courseInfo} />
      </div>
    </div>
  )
}

export default Course