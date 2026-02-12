"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

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
        return <div className='p-10 text-center'>Loading Analytics...</div>
    }

    if (!data) {
        return <div className='p-10 text-center'>No data available</div>
    }

    const { totalTimeSpent, completedCoursesCount, quizScores } = data;

    // Format Quiz Data for Chart
    // Group by course? Or just show timeline?
    // Let's show a timeline of quiz scores.
    const chartData = quizScores.map((item, index) => ({
        name: `Quiz ${index + 1}`,
        score: item.value,
        date: new Date(item.createdAt).toLocaleDateString()
    })).reverse(); // Oldest first?

    // Format Time Spent (just a value for now, maybe we can visualize distribution if we had more granular data)
    // For now, simple cards.

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }

  return (
    <div className='p-10 font-sans'>
        <h1 className='text-3xl font-bold mb-10'>Learning Analytics 📊</h1>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
            <div className='p-6 bg-slate-100 rounded-lg shadow-sm'>
                <h2 className='text-lg font-medium text-gray-500'>Total Time Spent</h2>
                <p className='text-4xl font-bold text-primary mt-2'>{formatTime(totalTimeSpent)}</p>
            </div>
            <div className='p-6 bg-slate-100 rounded-lg shadow-sm'>
                <h2 className='text-lg font-medium text-gray-500'>Courses Completed</h2>
                <p className='text-4xl font-bold text-primary mt-2'>{completedCoursesCount}</p>
            </div>
            <div className='p-6 bg-slate-100 rounded-lg shadow-sm'>
                <h2 className='text-lg font-medium text-gray-500'>Quizzes Taken</h2>
                <p className='text-4xl font-bold text-primary mt-2'>{quizScores.length}</p>
            </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <div className='h-[400px] border p-5 rounded-lg shadow-sm'>
                <h2 className='text-xl font-bold mb-5'>Quiz Performance History</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="label">{`${label} : ${payload[0].value}`}</p>
                                    <p className="intro">{`Date: ${payload[0].payload.date}`}</p>
                                </div>
                                );
                            }
                            return null;
                        }}/>
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

             {/* Placeholder for future charts */}
             <div className='h-[400px] border p-5 rounded-lg shadow-sm flex items-center justify-center bg-slate-50'>
                <p className='text-gray-400'>More insights coming soon...</p>
            </div>
        </div>
    </div>
  )
}

export default Analytics