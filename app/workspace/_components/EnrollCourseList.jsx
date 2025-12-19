"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard';

const EnrollCourseList = () => {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetEnrolledCourse();
  }, [])

  const normalizeRow = (row) => {
    // Try common shapes: { course, enrollCourse } or { courses: {...}, enrollCourse: {...} }
    let course = null;
    let enrollCourse = null;

    if (!row || typeof row !== 'object') return { course: null, enrollCourse: null };

    // Direct named properties
    course = row.course || row.courses || row.coursesTable || row.Courses || row.COURSES || null;
    enrollCourse = row.enrollCourse || row.enroll || row.enrollCourseTable || row.Enroll || null;

    // If not found, scan nested objects for likely candidates
    for (const k of Object.keys(row)) {
      const v = row[k];
      if (!course && v && typeof v === 'object' && (v.courseJson || v.name || v.description || v.noOfChapters || v.bannerImageUrl)) {
        course = v;
      }
      if (!enrollCourse && v && typeof v === 'object' && (v.completedChapters || v.userEmail)) {
        enrollCourse = v;
      }
    }

    // Fallback: the whole row might be the course object
    if (!course && (row.courseJson || row.name || row.description)) {
      course = row;
    }

    // If still missing but row has completedChapters at top level, use that
    if (!enrollCourse && (row.completedChapters || row.userEmail)) {
      enrollCourse = { completedChapters: row.completedChapters, cid: row.cid, userEmail: row.userEmail };
    }

    return { course, enrollCourse };
  }

  const GetEnrolledCourse = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/api/enroll-course');
      const data = result?.data;
      // If API returns an object with a data property, unwrap it
      const rows = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

      const normalized = rows.map(r => normalizeRow(r));
      // console.log('enroll-course raw:', data);
      // console.log('enroll-course normalized:', normalized);

      setEnrolledCourseList(normalized.filter(n => n.course));
    } catch (e) {
      console.error('Failed to fetch enrolled courses', e);
      setEnrolledCourseList([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  if (!enrolledCourseList || enrolledCourseList.length === 0) return null;

  return (
    <div className='mt-3'>
      <h2 className='font-bold pb-4 text-xl'> Continue Learning Courses</h2>
      <div className=" grid grid-col-1 md:grid-col-2 lg:grid-cols-3 xl:grid-col-3 gap-3">
{
        enrolledCourseList.map((item, index) => (
          <EnrollCourseCard course={item.course} enrollCourse={item.enrollCourse} key={index} />
        ))
      }
      </div>
      
    </div>
  )
}

export default EnrollCourseList