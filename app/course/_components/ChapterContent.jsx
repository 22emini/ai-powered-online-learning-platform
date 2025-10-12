import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import React, { useContext } from 'react'
import YouTube from 'react-youtube';

const ChapterContent = ({ courseInfo } = {}) => {
  // avoid destructuring from undefined
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectChapterIndexContext)
 const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
  const topics = courseContent?.[selectedChapterIndex]?.CourseContent?.topics ?? []

  return (
    // Add left margin on md+ to make room for fixed sidebar (w-80)
    <div className='p-10 md:ml-80'>
      <h2 className='font-bold text-2xl'>{selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.CourseContent?.chapterName}</h2>
      <h2 className='my-2 font-bodl text-lg'>Related Videos 🎥</h2>
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
