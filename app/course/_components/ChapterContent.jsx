"use client"
import { Button } from '@/components/ui/button';
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import axios from 'axios';
import { CheckCircle, Download, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { toast } from 'sonner';

const ChapterContent = ({ courseInfo, refreshData } = {}) => {
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectChapterIndexContext)
  const { courseId } = useParams();
  const [completedChapters, setCompletedChapters] = useState(enrollCourse?.completedChapters ?? []);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const totalChapters = courseContent?.length ?? 0;
  const currentChapter = courseContent?.[selectedChapterIndex];
  const topics = currentChapter?.CourseContent?.content || currentChapter?.CourseContent?.topics || [];
  const videoData = currentChapter?.youtubeVideo ?? [];
  const isChapterCompleted = completedChapters.includes(selectedChapterIndex);
  const completedCount = completedChapters.length;

  useEffect(() => {
    setCompletedChapters(enrollCourse?.completedChapters ?? []);
  }, [enrollCourse?.completedChapters]);

  const markChapterCompleted = async () => {
    if (loading || isChapterCompleted) return;
    setLoading(true);
    const previous = completedChapters;
    const updated = [...previous, selectedChapterIndex];
    setCompletedChapters(updated);
    try {
      await axios.put('/api/enroll-course', {
        courseId,
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
    if (loading || !isChapterCompleted) return;
    setLoading(true);
    const previous = completedChapters;
    const updated = previous.filter(i => i !== selectedChapterIndex);
    setCompletedChapters(updated);
    try {
      await axios.put('/api/enroll-course', {
        courseId,
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

  const onTakeQuiz = async () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);

    // If quiz already loaded for this chapter, don't fetch again?
    // But we might have different chapters. We should check if quiz matches current chapterId/Index.
    // For simplicity, let's fetch every time or check if quiz.chapterId matches.
    // We don't have quiz.chapterId stored in state easily unless we store it.
    // Let's just fetch/check.
    
    setQuizLoading(true);
    try {
        // Try Fetch
        const fetchRes = await axios.post('/api/get-quiz', {
            courseId: courseId,
            chapterId: selectedChapterIndex
        });

        if (fetchRes.data.found) {
            setQuiz(fetchRes.data.content);
        } else {
        // Generate
        const genRes = await axios.post('/api/generate-quiz', {
          courseId: courseId,
          chapterId: selectedChapterIndex,
          chapterContent: currentChapter
        });
        setQuiz(genRes.data?.content ?? genRes.data);
        }
    } catch (e) {
        console.error(e);
        toast.error('Failed to load quiz');
        setShowQuiz(false); 
    } finally {
        setQuizLoading(false);
    }
  }

  const handleOptionSelect = (option) => {
    setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: option
    }))
  }

  const handleNextQuestion = () => {
      if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
      } else {
          submitQuiz();
      }
  }

  // Analytics: Time Tracking
  const startTimeRef = React.useRef(Date.now());
  
  useEffect(() => {
    // Reset start time when chapter changes
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
        const now = Date.now();
        const diffSeconds = Math.floor((now - startTimeRef.current) / 1000);
        
        if (diffSeconds > 0) {
            // Send time spent to API
            axios.post('/api/analytics', {
                courseId: courseId,
                chapterId: selectedChapterIndex,
                eventType: 'TIME_SPENT',
                value: diffSeconds
            }).catch(e => console.error("Analytics error", e));
            
            // Reset start time to avoid double counting
            startTimeRef.current = Date.now();
        }
    }, 30000); // Update every 30 seconds

    return () => {
        clearInterval(interval);
        // Send remaining time on unmount or chapter change
        const now = Date.now();
        const diffSeconds = Math.floor((now - startTimeRef.current) / 1000);
        if (diffSeconds > 1) { // Only send if significant
            axios.post('/api/analytics', {
                courseId: courseId,
                chapterId: selectedChapterIndex,
                eventType: 'TIME_SPENT',
                value: diffSeconds
            }).catch(e => console.error("Analytics error", e));
        }
    };
  }, [courseId, selectedChapterIndex]);

  const submitQuiz = async () => {
      let score = 0;
      const total = quiz?.questions?.length || 0;
      
      quiz?.questions?.forEach((q, idx) => {
          if (userAnswers[idx] === q.correctAnswer) {
              score++;
          }
      });
      
      const percentage = (score / total) * 100;

      setQuizResult({
          score: score,
          total: total,
          percentage: percentage
      });

      // Analytics: Quiz Score
      try {
        await axios.post('/api/analytics', {
            courseId: courseId,
            chapterId: selectedChapterIndex,
            eventType: 'QUIZ_SCORE',
            value: score
        });
      } catch (e) {
          console.error("Failed to save quiz score", e);
      }
  }

  const downloadCourseContent = () => {
    if (downloading) return;
    if (!courseContent?.length) {
      toast.error('No course content available to download yet.');
      return;
    }

    try {
      setDownloading(true);
      const courseTitle = courseInfo?.courses?.courseName ?? 'course';
      const docBody = courseContent.map((chapter, cIndex) => {
        const chapterName = chapter?.CourseContent?.chapterName ?? `Chapter ${cIndex + 1}`;
        const chapterTopics = chapter?.CourseContent?.topics ?? [];
        const topicsMarkup = chapterTopics.map((topic, tIndex) => {
          const topicTitle = topic?.topic ?? `Topic ${tIndex + 1}`;
          const topicContent = topic?.content ?? '';
          return `
            <div>
              <h3>Topic ${tIndex + 1}: ${topicTitle}</h3>
              <div>${topicContent}</div>
            </div>
          `;
        }).join('');

        const videoMarkup = (chapter?.youtubeVideo ?? []).map((video, vIndex) => {
          const title = video?.title ?? `Video ${vIndex + 1}`;
          const url = video?.videoId ? `https://youtu.be/${video.videoId}` : '';
          return `<li>${title}${url ? ` - ${url}` : ''}</li>`;
        }).join('');

        return `
          <section>
            <h2>Chapter ${cIndex + 1}: ${chapterName}</h2>
            ${videoMarkup ? `<h3>Related Videos</h3><ul>${videoMarkup}</ul>` : ''}
            ${topicsMarkup || '<p>No topics available for this chapter.</p>'}
          </section>
        `;
      }).join('');

      const htmlTemplate = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>${courseTitle} Content</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h1, h2, h3 { color: #111827; }
              section { margin-bottom: 32px; }
            </style>
          </head>
          <body>
            <h1>${courseTitle} - Course Content</h1>
            ${docBody}
          </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', htmlTemplate], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${courseTitle.replace(/\s+/g, '-').toLowerCase()}-content.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Course content download started');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download course content');
    } finally {
      setDownloading(false);
    }
  }

  if (!courseContent?.length) {
    return (
      <section className='flex-1   w-full px-4 sm:px-6 lg:px-10 py-16 md:ml-80 xl:ml-96'>
        <div className='max-w-3xl mx-auto rounded-2xl border border-dashed bg-muted/40 p-10 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            Course content will appear here once chapters are added.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className='flex-1 mt-28 w-full px-4 sm:px-6 lg:px-10 py-8 md:ml-80 xl:ml-96'>
      <div className='max-w-5xl mx-auto space-y-10'>
        <header className='rounded-[28px] border bg-white/90 px-6 py-6 shadow-sm space-y-5'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
                Chapter {selectedChapterIndex + 1}/{totalChapters}
              </p>
              <h1 className='text-2xl font-semibold leading-tight text-foreground'>
                {currentChapter?.CourseContent?.chapterName ?? 'Select a chapter'}
              </h1>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                onClick={downloadCourseContent}
                disabled={downloading}
                aria-busy={downloading}
                aria-disabled={downloading}>
                {downloading ? (
                  <span className="inline-block mr-2 w-4 h-4 animate-spin" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                ) : (
                  <Download className='mr-2' />
                )}
                Download content
              </Button>
              <Button
                variant={isChapterCompleted ? 'outline' : 'default'}
                onClick={isChapterCompleted ? markChapterIncomplete : markChapterCompleted}
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}>
                {loading ? (
                  <span className="inline-block mr-2 w-4 h-4 animate-spin" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                ) : isChapterCompleted ? (
                  <X className='mr-2' />
                ) : (
                  <CheckCircle className='mr-2' />
                )}
                {isChapterCompleted ? 'Mark incomplete' : 'Mark completed'}
              </Button>
              <Button
                  variant='outline'
                  onClick={onTakeQuiz}>
                  Take Quiz
              </Button>
            </div>
          </div>
          <div className='flex flex-wrap gap-3 text-xs font-medium'>
            <span className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary'>
              <CheckCircle className='size-4' />
              {completedCount}/{totalChapters} chapters completed
            </span>
            <span className='inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-secondary-foreground'>
              {topics.length} topics in this chapter
            </span>
            <span className='inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-muted-foreground'>
              {videoData.length ? `${videoData.length} related videos` : 'Video resources coming soon'}
            </span>
          </div>
        </header>

        <section className='rounded-2xl border bg-white/80 p-6 shadow-sm space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
                Watch next
              </p>
              <h2 className='text-lg font-semibold'>Related videos 🎥</h2>
            </div>
            {videoData.length > 2 && (
              <span className='text-xs text-muted-foreground'>
                Showing top 2
              </span>
            )}
          </div>

          {videoData.length ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {videoData.slice(0, 2).map((video, index) => (
                <div
                  key={video?.videoId ?? index}
                  className='rounded-2xl border bg-secondary/30 p-3'>
                  <div className='aspect-video w-full overflow-hidden rounded-xl bg-black/80'>
                    <YouTube
                      videoId={video?.videoId}
                      opts={{
                        width: '100%',
                        height: '100%',
                      }}
                      iframeClassName='w-full h-full rounded-xl'
                      className='w-full h-full'
                    />
                  </div>
                  <p className='mt-3 text-sm font-medium leading-snug text-foreground'>
                    {video?.title ?? `Video ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center text-sm text-muted-foreground'>
              No videos added for this chapter yet.
            </div>
          )}
        </section>

        <section className='space-y-5'>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
              In this chapter
            </p>
            <h2 className='text-lg font-semibold'>Topics & notes</h2>
          </div>
          {topics.length ? (
            <div className='space-y-6'>
              {topics.map((topic, index) => (
                <article
                  key={topic?.topic ?? index}
                  className='rounded-2xl border bg-white/70 p-6 shadow-sm transition hover:border-primary/40'>
                  <div className='flex items-center gap-4'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary'>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className='text-sm uppercase tracking-[0.3em] text-muted-foreground'>
                        Topic {index + 1}
                      </p>
                      <h3 className='text-xl font-semibold text-foreground'>
                        {topic?.topic}
                      </h3>
                    </div>
                  </div>
                  <div
                    className='mt-5 text-sm leading-relaxed text-muted-foreground'
                    style={{ lineHeight: '1.9' }}
                    dangerouslySetInnerHTML={{ __html: topic?.content }} />
                </article>
              ))}
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed bg-muted/30 px-5 py-10 text-center text-sm text-muted-foreground'>
              No topics have been added to this chapter yet.
            </div>
          )}
        </section>

        <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className='max-w-2xl'>
            <DialogHeader>
                <DialogTitle>Chapter Quiz</DialogTitle>
                <DialogDescription>Test your knowledge on this chapter.</DialogDescription>
            </DialogHeader>

            {quizLoading ? (
                 <div className='py-8 flex justify-center'>Loading Quiz...</div> 
            ) : quizResult ? (
                 <div className='space-y-4 py-4'>
                    <h3 className='text-2xl font-bold'>{quizResult.percentage >= 70 ? 'Passed!' : 'Try Again'}</h3>
                    <p>You scored {quizResult.score} out of {quizResult.total} ({quizResult.percentage.toFixed(0)}%)</p>
                    <Button onClick={() => {setShowQuiz(false); setQuizResult(null); }}>Close</Button>
                 </div>
            ) : quiz && quiz.questions ? (
                 <div className='space-y-6 py-4'>
                    <div>
                        <span className='text-sm text-muted-foreground'>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                        <h3 className='text-lg font-semibold mt-2'>{quiz.questions[currentQuestionIndex].question}</h3>
                    </div>
                    <div className='space-y-2'>
                        {quiz.questions[currentQuestionIndex].options.map((option, idx) => (
                             <div 
                                key={idx} 
                                onClick={() => handleOptionSelect(option)}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${userAnswers[currentQuestionIndex] === option ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                             >
                                {option}
                             </div>
                        ))}
                    </div>
                 </div>
            ) : (
                <div>No quiz available.</div>
            )}
            
            <DialogFooter>
                {!quizLoading && !quizResult && quiz && quiz.questions && quiz.questions.length > 0 && (
                  <Button onClick={handleNextQuestion} disabled={!userAnswers[currentQuestionIndex]}>
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
                  </Button>
                )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </section>
  )
}

export default ChapterContent
