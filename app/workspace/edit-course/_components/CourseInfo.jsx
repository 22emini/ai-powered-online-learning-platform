" use client"
import { Button } from '@/components/ui/button';

import { Book, Clock, Loader, PlayCircle, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner';

const  CourseInfo = ({ course, viewCourse }) => {
    const courseLayout = course?.courseJson?.course;
    const [ loading,setLoading] = useState(false)
    const router = useRouter();

    const durationLabel = useMemo(() => {
        if (!courseLayout) return 'Duration not available';
        if (courseLayout?.duration) return courseLayout.duration;

        const chapters = courseLayout?.chapters || [];
        const totalMinutes = chapters.reduce((total, chapter) => {
            const durationText = chapter?.duration;
            if (!durationText) return total;

            const numericMatch = durationText.match(/[\d.]+/);
            if (!numericMatch) return total;

            const value = parseFloat(numericMatch[0]);
            if (Number.isNaN(value)) return total;

            const lowerCaseText = durationText.toLowerCase();
            if (lowerCaseText.includes('min')) {
                return total + value;
            }
            return total + value * 60;
        }, 0);

        if (!totalMinutes) return 'Duration not available';

        if (totalMinutes >= 60) {
            const hours = totalMinutes / 60;
            return Number.isInteger(hours)
                ? `${hours} hours`
                : `${hours.toFixed(1)} hours`;
        }

        return `${Math.round(totalMinutes)} minutes`;
    }, [courseLayout]);

    const GenerateCourseContent = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/generate-course-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseJson: courseLayout,
                    courseTitle: course?.name,
                    courseId: course?.cid,
                })
            })
            const data = await response.json();
            console.log(data)
            setLoading(false)
            router.replace('/workspace')
            toast('Course content generated successfully')
        } catch (e) {
            console.error('Error generating course content', e)
            toast.error('Server side error')
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='   md:flex gap-5 justify-between p-5 shadow rounded-2xl'>
<div className='  flex flex-col gap-5'>
    <h2 className='font-bold text-2xl'>{courseLayout?.name}</h2>
    <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>
    <div className='grid  grid-cols-1  md:grid-cols-3 gap-3'>
      <div className=' flex gap-2 items-center p-3 rounded-lg  shadow' >
        <Clock  className=' text-blue-500'/>
        <section>
            <h2 className=' font-bold'>Duration</h2>
            <h2>{durationLabel}</h2 >
        </section>
        </div>   
        <div className=' flex gap-1 items-center p-2 rounded-lg  shadow' >
        <Book  className=' text-green-500'/>
        <section>
            <h2 className=' font-bold'>Chapters</h2>
            <h2>{courseLayout?.noOfChapters} Chapters</h2>
        </section>
        </div>   
        <div className=' flex  gap-1 items-center p-2  rounded-lg  shadow' >
        <TrendingUp  className=' text-red-500'/>
        <section>
            <h2 className=' font-bold'>Difficulty level  </h2>
            <h2>{courseLayout?.level}</h2>
        </section>
        </div>     
    </div> 
     {!viewCourse ?
     
      <Button
          className={'max-w-sm mb-2'}
          onClick={GenerateCourseContent}
          disabled={loading || !courseLayout}
          aria-busy={loading}
          type="button"
      >
          {loading ?  <Loader className='animate-spin' /> : (<><Settings/> Generate Content</>)}
      </Button>
      : <Link href={'/course/'+course?.cid} ><Button > <PlayCircle />  Continue Learning </Button> </Link> }
</div>
<div>
    <Image src={course?.bannerImageUrl}  alt='banner image url'  width={700} height={400} className=' mt-5 aspect-auto md:mt-0 h-[240px]  object-cover rounded-2xl' />
</div>
    </div>
  )
}

export default CourseInfo
