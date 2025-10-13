"use client"
import { Button } from '@/components/ui/button';
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import axios from 'axios';
import { CheckCircle, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { toast } from 'sonner';

const ChapterContent = ({ courseInfo,    refreshData } = {}) => {
  // avoid destructuring from undefined
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectChapterIndexContext)
 const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
  const topics = courseContent?.[selectedChapterIndex]?.CourseContent?.topics ?? []
 const {courseId}=  useParams();
const [completedChapters, setCompletedChapters] = useState(enrollCourse?.completedChapters ?? []);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setCompletedChapters(enrollCourse?.completedChapters ?? []);
}, [enrollCourse?.completedChapters]);

const markChapterCompleted = async () => {
  if (loading) return;
  if (completedChapters.includes(selectedChapterIndex)) return;
  setLoading(true);
  const previous = completedChapters;
  const updated = [...previous, selectedChapterIndex];
  setCompletedChapters(updated);
  try {
    await axios.put('/api/enroll-course', {
      courseId: courseId,
      completedChapter: updated,
    });
    refreshData?.();
    toast.success('Chapter marked as completed');
  } catch (err) {
    console.error(err);
    setCompletedChapters(previous);
    toast.error('Failed to mark chapter completed');
  } finally {
    setLoading(false);
  }
}

const markChapterIncomplete = async () => {
  if (loading) return;
  if (!completedChapters.includes(selectedChapterIndex)) return;
  setLoading(true);
  const previous = completedChapters;
  const updated = previous.filter(i => i !== selectedChapterIndex);
  setCompletedChapters(updated);
  try {
    await axios.put('/api/enroll-course', {
      courseId: courseId,
      completedChapter: updated,
    });
    refreshData?.();
    toast.success('Chapter marked as incomplete');
  } catch (err) {
    console.error(err);
    setCompletedChapters(previous);
    toast.error('Failed to mark chapter incomplete');
  } finally {
    setLoading(false);
  }
}


return (
  // Add left margin on md+ to make room for fixed sidebar (w-80)
  <div className='p-10 md:ml-80'>
      <div className=' flex justify-between items-center'>
      <h2 className='font-bold text-2xl'>{selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.CourseContent?.chapterName}</h2>
     {!completedChapters.includes(selectedChapterIndex) ? (
       <Button onClick={markChapterCompleted} disabled={loading} aria-busy={loading} aria-disabled={loading}>
         {loading ? (
           <span className="inline-block mr-2 w-4 h-4 animate-spin" aria-hidden>
             <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
               <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
             </svg>
           </span>
         ) : (
           <CheckCircle className='mr-2' />
         )}
         Mark as Completed
       </Button>
     ) : (
       <Button variant={'outline'} onClick={markChapterIncomplete} disabled={loading} aria-busy={loading} aria-disabled={loading}>
         {loading ? (
           <span className="inline-block mr-2 w-4 h-4 animate-spin" aria-hidden>
             <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
               <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
             </svg>
           </span>
         ) : (
           <X className='mr-2' />
         )}
         Mark Incomplete
       </Button>
     )}
      </div>
      <h2 className='my-2 font-bold text-lg'>Related Videos 🎥</h2>
      <div className='grid grid-col-1 md:grid-cols-2 gap-5'>
{videoData?.slice(0,2).map((video,index)=>(
  <div key={video?.videoId ?? index}>

    <YouTube
      videoId={video?.videoId}
      opts={{
        height: '250',
        width: '400',
      }}
    />
  </div>
))}

      </div>
      <div className='mt-7'>
 {topics.map((topic,index)=>(

  <div className='mt-10 p-5 bg-secondary rounded-lg ' key={topic?.topic ?? index}>
    <h2 className='font-bold text-2xl text-primary'>{index + 1}. {topic?.topic}</h2>
    {/* <p>{topic?.content}</p> */}
    <div dangerouslySetInnerHTML={{__html: topic?.content}} style={{
      lineHeight:'2.5'
    }}></div>

  </div>
))}
      </div>
    </div>
  )
}

export default ChapterContent
