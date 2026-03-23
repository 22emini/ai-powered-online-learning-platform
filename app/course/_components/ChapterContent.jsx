"use client"
import { Button } from '@/components/ui/button';
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import axios from 'axios';
import { CheckCircle, Download, X, Swords, Shield, Trophy, Skull, Zap, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { toast } from 'sonner';
import { UserProgressContext } from '@/app/context/UserProgressContext';
import { Sparkles, Star } from 'lucide-react';

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
  const { refreshProgress } = useContext(UserProgressContext);
  const [answerFeedback, setAnswerFeedback] = useState(null); // { correct: bool, correctAnswer: string }

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
    setAnswerFeedback(null);

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
    if (answerFeedback) return; // Already answered this phase
    setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: option
    }))
    // Show immediate feedback
    const currentQ = quiz?.questions?.[currentQuestionIndex];
    const isCorrect = option === currentQ?.correctAnswer;
    setAnswerFeedback({ correct: isCorrect, correctAnswer: currentQ?.correctAnswer });
  }

  const handleNextQuestion = () => {
      setAnswerFeedback(null);
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
      const xpEarned = score * 100;

      setQuizResult({
          score: score,
          total: total,
          percentage: percentage,
          xpEarned: xpEarned
      });

      // Analytics: Quiz Score & XP
      try {
        await axios.post('/api/analytics', {
            courseId: courseId,
            chapterId: selectedChapterIndex,
            eventType: 'QUIZ_SCORE',
            value: score
        });
        
        await axios.post('/api/analytics', {
            courseId: courseId,
            chapterId: selectedChapterIndex,
            eventType: 'MISSION_XP',
            value: xpEarned
        });
        
        // Refresh global progress (Header/Sidebar)
        if (refreshProgress) refreshProgress();
      } catch (e) {
          console.error("Failed to save mission analytics", e);
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
      <section className='flex-1 w-full px-4 sm:px-6 lg:px-10 py-16 lg:ml-80 xl:ml-96'>
        <div className='max-w-3xl mx-auto rounded-2xl border border-dashed bg-muted/40 p-10 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            Course content will appear here once chapters are added.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className='flex-1 mt-28 w-full px-4 sm:px-6 lg:px-10 py-8 lg:ml-80 xl:ml-96'>
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
                  onClick={onTakeQuiz}
                  className='bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200'>
                  <Swords className='mr-2 w-4 h-4' />
                  Start Roleplay
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
        <DialogContent className='w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl max-h-[95vh] flex flex-col'>
            {/* Immersive Header */}
            <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 sm:px-6 py-4 sm:py-5 text-white flex-shrink-0'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm'>
                  <Swords className='w-5 h-5' />
                </div>
                <div>
                  <DialogHeader className='p-0 space-y-0'>
                    <DialogTitle className='text-white text-lg font-bold tracking-tight'>Interactive Roleplay Scenario</DialogTitle>
                    <DialogDescription className='text-white/80 text-sm'>Immerse yourself in a scenario and make the right decisions.</DialogDescription>
                  </DialogHeader>
                </div>
              </div>
              {/* Progress Bar */}
              {quiz && quiz.questions && !quizResult && !quizLoading && (
                <div className='mt-4'>
                  <div className='flex justify-between text-xs text-white/70 mb-1.5'>
                    <span>Phase {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + (answerFeedback ? 1 : 0)) / quiz.questions.length) * 100)}% Complete</span>
                  </div>
                  <div className='w-full h-2 bg-white/20 rounded-full overflow-hidden'>
                    <div 
                      className='h-full bg-gradient-to-r from-emerald-400 to-cyan-300 rounded-full transition-all duration-500 ease-out'
                      style={{ width: `${((currentQuestionIndex + (answerFeedback ? 1 : 0)) / quiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1'>
            {quizLoading ? (
                 <div className='py-12 flex flex-col items-center gap-4'>
                   <div className='w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center animate-pulse'>
                     <Shield className='w-8 h-8 text-indigo-600 animate-bounce' />
                   </div>
                   <div className='text-center'>
                     <p className='text-lg font-semibold text-foreground'>Generating Scenario...</p>
                     <p className='text-sm text-muted-foreground mt-1'>AI is crafting a unique roleplay scenario for you</p>
                   </div>
                 </div>
            ) : quizResult ? (
                 <div className='py-6 text-center space-y-5'>
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${quizResult.percentage >= 70 ? 'bg-gradient-to-br from-emerald-100 to-green-100' : 'bg-gradient-to-br from-red-100 to-orange-100'}`}>
                      {quizResult.percentage >= 70 
                        ? <Trophy className='w-10 h-10 text-emerald-600' />
                        : <Skull className='w-10 h-10 text-red-500' />
                      }
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${quizResult.percentage >= 70 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {quizResult.percentage >= 70 ? 'Mission Accomplished!' : 'Mission Failed'}
                      </h3>
                      <p className='text-muted-foreground mt-2'>
                        You completed <span className='font-bold text-foreground'>{quizResult.score}</span> out of <span className='font-bold text-foreground'>{quizResult.total}</span> actions correctly
                      </p>
                    </div>
                    <div className='flex items-center justify-center gap-3'>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${quizResult.percentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        <Zap className='w-4 h-4 inline mr-1' />
                        {quizResult.percentage.toFixed(0)}% Score
                      </div>
                      <div className='px-4 py-2 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700'>
                        <Sparkles className='w-4 h-4 inline mr-1' />
                        +{quizResult.xpEarned} XP
                      </div>
                    </div>
                    <div className='flex gap-3 justify-center pt-2'>
                      <Button variant='outline' onClick={() => {setShowQuiz(false); setQuizResult(null); }}>Close</Button>
                      {quizResult.percentage < 70 && (
                        <Button onClick={() => { setQuizResult(null); setCurrentQuestionIndex(0); setUserAnswers({}); setAnswerFeedback(null); }} className='bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'>
                          <Target className='w-4 h-4 mr-2' /> Retry Mission
                        </Button>
                      )}
                    </div>
                 </div>
            ) : quiz && quiz.questions ? (
                 <div className='space-y-5'>
                    <div className='rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100 p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm flex-shrink-0 mt-0.5'>
                            {currentQuestionIndex + 1}
                          </div>
                          <div>
                            <span className='text-xs font-medium text-indigo-500 uppercase tracking-wider'>Scenario Briefing</span>
                            <h3 className='text-base font-semibold mt-1 text-foreground leading-relaxed'>{quiz.questions[currentQuestionIndex].question}</h3>
                          </div>
                        </div>
                    </div>
                    <div className='space-y-2.5'>
                      <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Choose your action:</p>
                        {quiz.questions[currentQuestionIndex].options.map((option, idx) => {
                          const isSelected = userAnswers[currentQuestionIndex] === option;
                          const isCorrectOption = answerFeedback && option === answerFeedback.correctAnswer;
                          const isWrongSelection = answerFeedback && isSelected && !answerFeedback.correct;
                          
                          let optionClasses = 'p-3.5 border rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-3 ';
                          if (answerFeedback) {
                            if (isCorrectOption) {
                              optionClasses += 'border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-100';
                            } else if (isWrongSelection) {
                              optionClasses += 'border-red-400 bg-red-50 text-red-800 shadow-sm shadow-red-100';
                            } else {
                              optionClasses += 'border-gray-200 bg-gray-50 text-muted-foreground opacity-60';
                            }
                          } else if (isSelected) {
                            optionClasses += 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm shadow-indigo-100 ring-2 ring-indigo-200';
                          } else {
                            optionClasses += 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm';
                          }

                          return (
                             <div 
                                key={idx} 
                                onClick={() => handleOptionSelect(option)}
                                className={optionClasses}
                             >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                  answerFeedback && isCorrectOption ? 'bg-emerald-500 text-white' :
                                  isWrongSelection ? 'bg-red-500 text-white' :
                                  isSelected ? 'bg-indigo-500 text-white' :
                                  'bg-gray-200 text-gray-600'
                                }`}>
                                  {answerFeedback && isCorrectOption ? <CheckCircle className='w-4 h-4' /> :
                                   isWrongSelection ? <X className='w-4 h-4' /> :
                                   String.fromCharCode(65 + idx)}
                                </div>
                                <span className='text-sm leading-snug'>{option}</span>
                             </div>
                          );
                        })}
                    </div>
                    {/* Feedback message */}
                    {answerFeedback && (
                      <div className={`rounded-xl p-3.5 text-sm flex items-start gap-2.5 ${answerFeedback.correct ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                        {answerFeedback.correct 
                          ? <><CheckCircle className='w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5' /> <span><strong>Correct action!</strong> You handled this situation perfectly.</span></>
                          : <><Shield className='w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5' /> <span><strong>Not quite right.</strong> The correct action was: <em>{answerFeedback.correctAnswer}</em></span></>
                        }
                      </div>
                    )}
                 </div>
            ) : (
                <div className='py-8 text-center text-muted-foreground'>No scenario available.</div>
            )}
            </div>
            
            {/* Footer */}
            {!quizLoading && !quizResult && quiz && quiz.questions && quiz.questions.length > 0 && (
              <div className='px-4 sm:px-6 pb-4 sm:pb-5 flex justify-end flex-shrink-0'>
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={!answerFeedback}
                  className='bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-6'
                >
                  {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Phase →' : 'Complete Mission →'}
                </Button>
              </div>
            )}
        </DialogContent>
      </Dialog>
      </div>
    </section>
  )
}

export default ChapterContent
