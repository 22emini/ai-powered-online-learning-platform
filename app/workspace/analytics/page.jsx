"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Timer, BookOpen, Trophy, TrendingUp, Sparkles, Activity } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const result = await axios.get('/api/analytics');
            setData(result.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
                />
                <p className='mt-4 text-muted-foreground font-medium'>Loading your learning insights...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div className='bg-muted/50 p-6 rounded-full mb-4'>
                    <Activity className='w-12 h-12 text-muted-foreground' />
                </div>
                <h2 className='text-xl font-semibold mb-2'>No data available</h2>
                <p className='text-muted-foreground'>Start learning to see your analytics here!</p>
            </div>
        )
    }

    const { totalTimeSpent, completedCoursesCount, quizScores } = data;

    const chartData = quizScores.map((item, index) => ({
        name: `Quiz ${index + 1}`,
        score: item.value,
        date: new Date(item.createdAt).toLocaleDateString()
    })).reverse();

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }

    return (
        <div className='p-6 md:p-10 font-sans min-h-screen bg-transparent'>
            <div className="mb-10">
                <div className="inline-flex mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold items-center gap-2 shadow-sm border border-primary/20">
                    <Sparkles className="w-4 h-4" /> Your Progress
                </div>
                <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-600 dark:from-primary dark:via-purple-400 dark:to-indigo-500 mb-2'>
                    Learning Analytics
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-medium">
                    Track your journey, visualize your performance, and celebrate your wins.
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
                <div className='p-6 bg-white dark:bg-zinc-900/90 rounded-[2rem] shadow-xl shadow-blue-900/5 dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group'>
                    <div className="absolute -top-10 -right-10 p-4 opacity-5">
                        <Timer className="w-48 h-48 text-blue-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-200/50 dark:border-blue-500/30">
                            <Timer className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className='text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-1'>Total Time Spent</h2>
                            <p className='text-5xl font-black text-gray-900 dark:text-white tracking-tight'>{formatTime(totalTimeSpent)}</p>
                        </div>
                    </div>
                </div>

                <div className='p-6 bg-white dark:bg-zinc-900/90 rounded-[2rem] shadow-xl shadow-emerald-900/5 dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group'>
                    <div className="absolute -top-10 -right-10 p-4 opacity-5">
                        <BookOpen className="w-48 h-48 text-emerald-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-200/50 dark:border-emerald-500/30">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className='text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-1'>Courses Completed</h2>
                            <p className='text-5xl font-black text-gray-900 dark:text-white tracking-tight'>{completedCoursesCount}</p>
                        </div>
                    </div>
                </div>

                <div className='p-6 bg-white dark:bg-zinc-900/90 rounded-[2rem] shadow-xl shadow-amber-900/5 dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group'>
                    <div className="absolute -top-10 -right-10 p-4 opacity-5">
                        <Trophy className="w-48 h-48 text-amber-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-amber-200/50 dark:border-amber-500/30">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className='text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-1'>Quizzes Taken</h2>
                            <p className='text-5xl font-black text-gray-900 dark:text-white tracking-tight'>{quizScores.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2 bg-white dark:bg-zinc-900/95 border border-gray-100 dark:border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-purple-900/5 dark:shadow-none backdrop-blur-xl flex flex-col'>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className='text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white'>
                                <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                Quiz Performance
                            </h2>
                            <p className="text-muted-foreground mt-2 font-medium">Your score trajectory over time.</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-white/5" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                        color: '#1f2937',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#8b5cf6', fontWeight: '800', fontSize: '1.25rem' }}
                                    formatter={(value, name) => [value, 'Score']}
                                    labelStyle={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8b5cf6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff', fill: '#8b5cf6', style: { filter: 'drop-shadow(0px 4px 6px rgba(139, 92, 246, 0.5))' } }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-500/20 p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden'>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-white/50 dark:border-white/10 rotate-3 transition-transform">
                            <Sparkles className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">More Insights Coming Soon</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8 font-medium leading-relaxed">
                            We are crunching the numbers to bring you deeper insights into your learning habits, strengths, and personal areas for improvement.
                        </p>
                        <button className="px-8 py-3 bg-white dark:bg-zinc-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 text-sm font-bold text-gray-900 dark:text-white rounded-full shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 group">
                            <span className="flex items-center gap-2">
                                Suggest a Metric
                                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics