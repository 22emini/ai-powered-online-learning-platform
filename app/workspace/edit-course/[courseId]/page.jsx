"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../../_components/ChapterTopicList';

const EditCourse = ({viewCourse=false}) => {
    const { courseId} = useParams(); 
    const[ loading,setLoading]= useState(false);

    const [ course, setCourse]= useState();
    const GetCourseInfo=async()=>{
const result = await axios.get('/api/courses?courseId='+courseId);
console.log(result.data);


setLoading(false);
setCourse(result.data)
    }
    useEffect(() => {
        GetCourseInfo();
    },[])
  return (
    <div>
      <CourseInfo course={course}  viewCourse={viewCourse}/>
      <ChapterTopicList course={course}     refreshData={() => GetEnrolledCourseById()} />
    </div>
  )
}

export default EditCourse