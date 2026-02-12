import { db } from "@/config/db";
import { desc, eq, ne, sql } from "drizzle-orm";
import { coursesTable, enrollCourseTable, chapterQuizzes, userAnalyticsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req){

    const { searchParams} = new URL (req.url);
     const courseId = searchParams?.get('courseId');
 const user =  await currentUser();

 if(courseId =='0'){
     const result = await db.select().from(coursesTable).where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);
// console.log(result);

      // return the full list of courses (array) so the client can map over it
      return NextResponse.json(result);

 }
     if(courseId){
   const result = await  db.select().from(coursesTable).where(eq(coursesTable.cid,courseId));
// console.log(result);

     if (!result || result.length === 0) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
     }
     return NextResponse.json(result[0]);
     }
     else{
          const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(coursesTable.id))
// console.log(result);

     return NextResponse.json(result);
     }
  

    
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get('courseId');
  const user = await currentUser();

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    // 1. Verify user owns the course
    const course = await db.select().from(coursesTable)
      .where(sql`${coursesTable.cid} = ${courseId} AND ${coursesTable.userEmail} = ${user?.primaryEmailAddress?.emailAddress}`);

    if (!course || course.length === 0) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 404 });
    }

    // 2. Delete from enrollCourseTable
    await db.delete(enrollCourseTable).where(eq(enrollCourseTable.cid, courseId));

    // 3. Delete from chapterQuizzes
    await db.delete(chapterQuizzes).where(eq(chapterQuizzes.courseId, courseId));

    // 4. Delete from userAnalyticsTable
    await db.delete(userAnalyticsTable).where(eq(userAnalyticsTable.courseId, courseId));

    // 5. Delete from coursesTable (Primary)
    await db.delete(coursesTable).where(eq(coursesTable.cid, courseId));


    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
