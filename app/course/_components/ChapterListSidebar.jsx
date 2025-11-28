import React, { useContext, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Menu, CheckCircle2, X } from 'lucide-react'
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import Link from 'next/link'

const ChapterListSidebar = ({courseInfo}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const selectChapterCtx = useContext(SelectChapterIndexContext) ?? {};
  const { selectedChapterIndex, setSelectedChapterIndex } = selectChapterCtx;
  const completedChapter = enrollCourse?.completedChapters ?? [];
  const totalChapters = courseContent?.length ?? 0;
  const completedCount = completedChapter.length;
  const progress = totalChapters
    ? Math.round((completedCount / totalChapters) * 100)
    : 0;
  const courseTitle = course?.courseName ?? 'Course outline';

  const handleChapterClick = (index) => {
    setSelectedChapterIndex?.(index);
    setSheetOpen(false); // Close sheet on mobile after selection
  }

  const ChapterHeading = () => (
    <div className='space-y-3 sm:space-y-4'>
      

      <div>
        <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
          {course?.category ?? 'Course'}
        </p>
        <h2 className='font-semibold text-lg sm:text-xl leading-tight text-foreground mt-1'>
          {courseTitle}
        </h2>
        <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
          {totalChapters} chapters • {completedCount} completed
        </p>
      </div>
      <div>
        <div className='flex items-center justify-between text-xs font-medium text-muted-foreground mb-1.5'>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} aria-label='Course completion progress' className='h-2' />
      </div>
      <Link href={"/workspace"} className='mb-2'><Button> Return To workspace</Button></Link>
    </div>
  )

  const ChapterAccordion = () => (
    <Accordion type="single" collapsible className='space-y-2'>
      {courseContent?.map((chapter, index) => {
        const isCompleted = completedChapter.includes(index);
        const isActive = selectedChapterIndex === index;
        return (
          <AccordionItem
            className={`rounded-xl sm:rounded-2xl border shadow-sm transition-all ${
              isCompleted
                ? 'bg-emerald-50/80 border-emerald-200'
                : isActive
                  ? 'bg-primary/5 border-primary/40'
                  : 'bg-white/70 hover:border-primary/30'
            }`}
            value={chapter?.CourseContent?.chapterName}
            key={index}
            onClick={() => handleChapterClick(index)}>
            <AccordionTrigger className='px-4 sm:px-5 py-3 sm:py-4 text-left hover:no-underline'>
              <div className='flex items-start gap-2.5 sm:gap-3 w-full'>
                {isCompleted ? (
                  <CheckCircle2 className='size-5 text-green-600 shrink-0 mt-0.5' />
                ) : (
                  <div className={`size-5 rounded-full border-2 shrink-0 mt-0.5 ${
                    isActive ? 'border-primary' : 'border-gray-300'
                  }`} />
                )}
                <div className='flex-1 min-w-0'>
                  <p className={`font-medium text-sm sm:text-base leading-snug ${
                    isCompleted ? 'text-green-800' : isActive ? 'text-primary' : 'text-gray-900'
                  }`}>
                    {index + 1}. {chapter?.CourseContent?.chapterName}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {chapter?.CourseContent?.topics?.length ?? 0} topics
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className='px-4 sm:px-5 pb-3 sm:pb-4 space-y-2'>
                {chapter?.CourseContent?.topics?.map((topic, index_) => (
                  <div
                    className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors border ${
                      isCompleted 
                        ? 'bg-emerald-100/70 text-green-900 border-emerald-100' 
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-100'
                    }`}
                    key={index_}>
                    <p className='leading-relaxed'>{topic?.topic}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <nav 
        aria-label="Chapters" 
        className='hidden lg:block fixed left-0 top-16 w-80 xl:w-96 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 px-5 py-6 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto border-r'>
        <div className='rounded-2xl border bg-white/70 p-5 shadow-sm'>
          <ChapterHeading />
        </div>
        <ChapterAccordion />
      </nav>

      {/* Mobile/Tablet trigger + sheet */}
      <div className='lg:hidden fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b shadow-sm'>
        <div className='px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4'>
          <div className='flex-1 min-w-0 space-y-0.5 sm:space-y-1'>
            <p className='text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em]'>
              Course outline
            </p>
            <div>
              <p className='font-semibold text-xs sm:text-sm truncate leading-tight'>
                {courseTitle}
              </p>
              <p className='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>
                {completedCount}/{totalChapters} completed • {progress}%
              </p>
            </div>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant='outline' 
                size='sm' 
                aria-label='Open chapters' 
                className='shrink-0 h-9 sm:h-10 px-3 sm:px-4'>
                <Menu className='size-4 mr-1.5 sm:mr-2' />
                <span className='text-xs sm:text-sm'>Chapters</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side='left' 
              className='w-[85vw] sm:w-full sm:max-w-md p-0 flex flex-col'>
              <SheetHeader className='border-b px-4 py-3 sm:px-6 sm:py-4'>
                <SheetTitle className='text-left'>
                  <ChapterHeading />
                </SheetTitle>
              </SheetHeader>
              <div className='flex-1 overflow-y-auto p-3 sm:p-4'>
                <ChapterAccordion />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for fixed mobile header */}
      <div className='lg:hidden h-[72px] sm:h-[76px]' aria-hidden='true' />
    </>
  )
}

export default ChapterListSidebar