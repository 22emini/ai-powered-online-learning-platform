import { Button } from '@/components/ui/button';

import { Book, LoaderCircle, PlayCircle, Settings, Trash } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const CourseCard = ({ course, refreshCourses }) => {
  const [loading, setLoading]= useState(false)
  const courseJson = course?.courseJson?.course;
  const hasContent = Boolean(course?.courseContent?.length);
 const onEnrollCourse = async () => {
   try {
     setLoading(true);
     const response = await fetch('/api/enroll-course', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         courseId: course?.cid,
       })
     });
     const data = await response.json();
     console.log(data);
if(data.resp){
  toast.warning('Already Enrolled!')
}
     toast.success('Enrolled');

   } catch (e) {
     console.error(e);
     toast.error('Server error');
   } finally {
     setLoading(false);
   }
 };

 const handleDelete = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/courses?courseId=${course?.cid}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      toast.success('Course deleted successfully');
      refreshCourses && refreshCourses();
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete course');
  } finally {
    setLoading(false);
  }
 };

  return (
    <div className="rounded-xl mt-4 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1">
      <div className="relative">
        <Image
          src={course?.bannerImageUrl || '/online-education.png'}
          alt={courseJson?.name || course?.name || 'Course banner'}
          width={360}
          height={202}
          className="w-full aspect-video object-cover"
        />

        {/* subtle gradient so text/icons contrast on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent pointer-events-none" aria-hidden />

        <span className="absolute top-2 left-2 inline-flex items-center gap-2 bg-white/90 text-xs text-gray-800 px-1.5 py-0.5 rounded-md shadow-sm">
          <Book className="h-3.5 w-3.5 text-gray-700" />
          <span className="font-medium text-xs">{courseJson?.noOfChapters ?? 0} chapters</span>
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2.5">
        <h3 className="font-semibold text-md leading-5 line-clamp-2">{courseJson?.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-3">{courseJson?.description}</p>

        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-1.5 py-0.5 rounded-md">
              <PlayCircle className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs">{courseJson?.estimatedDuration ?? '—'}</span>
            </span>

            <span className="text-xs text-gray-400">By {course?.author ?? 'Unknown'}</span>
          </div>

          <div className="flex gap-2">
            {hasContent ? (
        
                <Button size="sm" disabled={loading} onClick={onEnrollCourse} className="flex items-center gap-2 px-2 py-1">
                 {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                   Enroll Course
                </Button>
             
            ) : (
              <Link href={`/workspace/edit-course/${course?.cid}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-2 px-2 py-1">
                  <Settings className="h-3.5 w-3.5" />
                  Generate Course
                </Button>
              </Link>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"  className="px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your course
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Delete'} 
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;