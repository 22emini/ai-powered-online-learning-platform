"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../../_components/ChapterTopicList';

const EditCourse = ({ viewCourse = false }) => {
    const { courseId } = useParams(); 
    const [loading, setLoading] = useState(false);

    const [course, setCourse] = useState();
    const [error, setError] = useState(null);

    const GetCourseInfo=async()=>{
        if(!courseId) return;
        setLoading(true);
        setError(null);
        try{
            const response = await fetch('/api/courses?courseId='+courseId);
            const data = await response.json();
            console.log(data);
            setCourse(data);
        }catch(err){
            console.error('Failed to fetch course info', err);
            setError('Unable to load course details. Please try again.');
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        GetCourseInfo();
    },[courseId])
  return (
    <div>
      {loading && <p className='text-center py-4 text-gray-500'>Loading course details...</p>}
      {error && <p className='text-center py-4 text-red-500'>{error}</p>}
      {!loading && !error && course && (
        <>
          <CourseInfo course={course}  viewCourse={viewCourse}/>
          <ChapterTopicList course={course} />
        </>
      )}
    </div>
  )
}

export default EditCourse