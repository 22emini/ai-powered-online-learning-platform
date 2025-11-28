"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react"
import Image from 'next/image'
import Link from "next/link"
import React, { useMemo, useState } from 'react'

const EnrollCourseCard = ({ course, enrollCourse }) => {
  const [loading] = useState(false)
  const courseJson = course?.courseJson?.course;
  const completedCount = Array.isArray(enrollCourse?.completedChapters)
    ? enrollCourse.completedChapters.length
    : enrollCourse?.completedChapters && typeof enrollCourse.completedChapters === 'object'
    ? Object.keys(enrollCourse.completedChapters).length
    : Number(enrollCourse?.completedChapters) || 0;

  const totalChapters = Array.isArray(course?.courseContent)
    ? course.courseContent.length
    : course?.courseContent && typeof course.courseContent === 'object'
    ? Object.keys(course.courseContent).length
    : Number(courseJson?.noOfChapters) || 0;

  const progressPercent = useMemo(() => {
    if (!totalChapters) return 0;
    const percent = (completedCount / totalChapters) * 100;
    if (!Number.isFinite(percent)) return 0;
    return Math.min(Math.max(Math.round(percent), 0), 100);
  }, [completedCount, totalChapters]);

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1 max-w-xs">
      <div className="relative">
        <Image
          src={course?.bannerImageUrl}
          alt={courseJson?.name || course?.name || 'Course banner'}
          width={320}
          height={180}
          className="w-full object-cover h-36"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" aria-hidden />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-semibold text-sm leading-5 line-clamp-2">{courseJson?.name || course?.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-3">{courseJson?.description || course?.description}</p>

        <h2 className=" flex justify-between text-sm text-[#132B55]">Progress <span>{progressPercent}%</span></h2>
          <div className="text-xs text-gray-600"><Progress value={progressPercent} /></div>
          <Link href={'/workspace/view-course/'+ course?.cid} >
              <Button className={'w-full mt-3'}><PlayCircle /> Continue learnig</Button>
          </Link>

      </div>
    </div>
  )
}

export default EnrollCourseCard