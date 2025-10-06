import { Button } from '@/components/ui/button';
import { Book, PlayCircle, Settings } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const CourseCard = ({ course }) => {
  const courseJson = course?.courseJson?.course;
  const hasContent = Boolean(course?.courseContent?.length);

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1">
      <div className="relative">
        <Image
          src={course?.bannerImageUrl || '/online-education.png'}
          alt={courseJson?.name || course?.name || 'Course banner'}
          width={400}
          height={225}
          className="w-full aspect-video object-cover"
        />

        {/* subtle gradient so text/icons contrast on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" aria-hidden />

        <span className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white/90 text-xs text-gray-800 px-2 py-1 rounded-md shadow-sm">
          <Book className="h-4 w-4 text-gray-700" />
          <span className="font-medium">{courseJson?.noOfChapters ?? 0} chapters</span>
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-lg leading-6 line-clamp-2">{courseJson?.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-3">{courseJson?.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <PlayCircle className="h-4 w-4 text-primary" />
              <span className="text-xs">{courseJson?.estimatedDuration ?? '—'}</span>
            </span>

            <span className="text-xs text-gray-400">By {course?.author ?? 'Unknown'}</span>
          </div>

          <div>
            {hasContent ? (
              <Link href={`/workspace/${course?.cid || ''}`}>
                <Button size="sm" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Start Learning
                </Button>
              </Link>
            ) : (
              <Link href={`/workspace/edit-course/${course?.cid}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Generate Course
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;