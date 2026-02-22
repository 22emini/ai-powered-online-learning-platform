"use client"
import axios from 'axios'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard';

const EnrollCourseList = () => {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 3; // Show fewer on the dashboard maybe? Or keep it consistent.

  useEffect(() => {
    GetEnrolledCourse(1);
  }, [])

  const normalizeRow = (row) => {
    let course = null;
    let enrollCourse = null;

    if (!row || typeof row !== 'object') return { course: null, enrollCourse: null };

    course = row.course || row.courses || row.coursesTable || null;
    enrollCourse = row.enrollCourse || row.enrollCourseTable || null;

    // Fallback logic if needed
    if (!course) {
       for (const k of Object.keys(row)) {
         const v = row[k];
         if (v && typeof v === 'object' && (v.courseJson || v.name)) {
           course = v;
         }
       }
    }
    if (!enrollCourse) {
       for (const k of Object.keys(row)) {
         const v = row[k];
         if (v && typeof v === 'object' && v.completedChapters !== undefined) {
           enrollCourse = v;
         }
       }
    }

    return { course, enrollCourse };
  }

  const GetEnrolledCourse = async (page = 1) => {
    setLoading(true);
    try {
      const result = await axios.get('/api/enroll-course?page=' + page + '&limit=' + limit);
      const data = result?.data;
      const rows = data?.data || [];

      const normalized = rows.map(r => normalizeRow(r));
      setEnrolledCourseList(normalized.filter(n => n.course));
      setTotalPages(data?.pagination?.totalPages || 0);
      setCurrentPage(data?.pagination?.currentPage || 1);
    } catch (e) {
      console.error('Failed to fetch enrolled courses', e);
      setEnrolledCourseList([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading && enrolledCourseList.length === 0) return (
     <div className='mt-3'>
        <h2 className='font-bold pb-4 text-xl'> Continue Learning Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
           {[1,2,3].map(i => <div key={i} className='h-[150px] bg-slate-100 animate-pulse rounded-xl'></div>)}
        </div>
     </div>
  );

  if (!enrolledCourseList || enrolledCourseList.length === 0) return null;

  return (
    <div className='mt-3 mb-10'>
      <h2 className='font-bold pb-4 text-xl'> Continue Learning Courses</h2>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {enrolledCourseList.map((item, index) => (
          <EnrollCourseCard course={item.course} enrollCourse={item.enrollCourse} key={index} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-5 mt-8'>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => GetEnrolledCourse(currentPage - 1)}
          >
            Previous
          </Button>
          <span className='text-xs font-medium'>
             {currentPage} / {totalPages}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => GetEnrolledCourse(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default EnrollCourseList