import React, { useContext } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';

const ChapterListSidebar = ({courseInfo}) => {
  const course= courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
    const {selectedChapterIndex,setSelectedChapterIndex}= useContext(SelectChapterIndexContext)

  return (
    // Hide on small screens, fixed on md+ so content can scroll independently
    <nav aria-label="Chapters" className='hidden md:block fixed left-0 top-16 w-80 bg-secondary p-5 h-[calc(100vh-4rem)] overflow-y-auto'>
      <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent?.length}) </h2>
      <Accordion type="single" collapsible>
        {courseContent?.map((chapter, index) => {

          return (
            <AccordionItem className={'text-lg font-medium'} value={chapter?.CourseContent?.chapterName} key={index}  onClick={()=> setSelectedChapterIndex(index)}>
              <AccordionTrigger>{index + 1 } . {chapter?.CourseContent?.chapterName}</AccordionTrigger>
              <AccordionContent asChild>
                <div className=''>
     {chapter?.CourseContent?.topics?.map((topic, index) => (
                  <h2 className='p-3  rounded-lg my-1 bg-white' key={index}>{topic?.topic}</h2>
                ))}
                </div>
           
              </AccordionContent>
            </AccordionItem>
          )
        })}
  
</Accordion>
    </nav>
  )
}

export default ChapterListSidebar