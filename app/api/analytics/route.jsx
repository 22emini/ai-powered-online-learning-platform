import { db } from "@/config/db";
import { userAnalyticsTable, coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        const { courseId, chapterId, eventType, value } = await req.json();

        if (!eventType || value === undefined) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await db.insert(userAnalyticsTable).values({
            userEmail,
            courseId,
            chapterId,
            eventType, // 'TIME_SPENT', 'QUIZ_SCORE'
            value,
            createdAt: new Date().toISOString()
        }).returning(userAnalyticsTable);

        return NextResponse.json(result[0]);

    } catch (error) {
         console.error("Error in analytics POST:", error);
         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        // 1. Total Time Spent (Sum of 'TIME_SPENT' values)
        // Note: value is in seconds.
        // We can do this aggregation in JS or SQL. SQL is better.
        // Drizzle might need sql`` for aggregation.
        
        // This query fetches all analytics for the user. 
        // For a full dashboard, individual queries or one big fetch is fine. 
        // Given likely scale, let's fetch all relevant records and process or do precise aggregation queries.
        // Let's do simple SQL aggregation for time.

        // Time Spent
        const timeResult = await db.select({ 
            totalTime: sql`sum(${userAnalyticsTable.value})` 
        })
        .from(userAnalyticsTable)
        .where(
            and(
                eq(userAnalyticsTable.userEmail, userEmail),
                eq(userAnalyticsTable.eventType, 'TIME_SPENT')
            )
        );

        const totalTimeSpent = timeResult[0]?.totalTime ? parseInt(timeResult[0].totalTime) : 0;

        // 2. Courses Completed
        // We have enrollCourseTable for this.
        // Completed course logic: completedChapters length == noOfChapters from coursesTable?
        // Or we can just count enrollments where all chapters are done. 
        // For now, let's just use enrollCourseTable to see enrolled vs completed.
        // But enrollCourseTable stores `completedChapters` as JSON list.
        // We need to compare it with course `noOfChapters`.
        
        const enrolledCourses = await db.select()
        .from(enrollCourseTable)
        .where(eq(enrollCourseTable.userEmail, userEmail));

        // We need course details to know total chapters
        const courseIds = enrolledCourses.map(e => e.cid);
        let completedCoursesCount = 0;

        if (courseIds.length > 0) {
            // Fetch courses to check total chapters
            const courses = await db.select().from(coursesTable).where(sql`${coursesTable.cid} IN ${courseIds}`);
            
            enrolledCourses.forEach(enrollment => {
                const course = courses.find(c => c.cid === enrollment.cid);
                if (course) {
                    const totalChapters = course.noOfChapters;
                    const completedChapters = enrollment.completedChapters || [];
                    if (completedChapters.length >= totalChapters && totalChapters > 0) {
                        completedCoursesCount++;
                    }
                }
            });
        }

        // 3. Quiz Scores Over Time
        // Fetch 'QUIZ_SCORE' events, order by createdAt
        const quizScores = await db.select()
            .from(userAnalyticsTable)
            .where(
                and(
                    eq(userAnalyticsTable.userEmail, userEmail),
                    eq(userAnalyticsTable.eventType, 'QUIZ_SCORE')
                )
            )
            .orderBy(desc(userAnalyticsTable.createdAt));
            //.limit(50); // Optional limit

        return NextResponse.json({ 
            totalTimeSpent, 
            completedCoursesCount, 
            quizScores 
        });

    } catch (error) {
        console.error("Error in analytics GET:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
