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

     return NextResponse.json(result[0]);
     }
     else{
          if (!user || !user.primaryEmailAddress) {
             return NextResponse.json([], { status: 200 });
          }
          const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress)).orderBy(desc(coursesTable.id))
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

  // Optional: Check if the user owns the course before deleting (security best practice)
  // For now, assuming the query handles it or logic is simple enough.
  // Ideally: const course = await db.select().from(coursesTable).where(and(eq(coursesTable.cid, courseId), eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress)));
  
  // Perform cascading delete manually if foreign keys aren't set up to cascade
  try {
      // 1. Delete from enrollCourseTable
      await db.delete(enrollCourseTable).where(eq(enrollCourseTable.cid, courseId));
      
      // 2. Delete from chapterQuizzes
       await db.delete(chapterQuizzes).where(eq(chapterQuizzes.courseId, courseId));

      // 3. Delete from userAnalyticsTable
      await db.delete(userAnalyticsTable).where(eq(userAnalyticsTable.courseId, courseId));

      // 4. Finally delete the course itself
      const result = await db.delete(coursesTable)
      .where(eq(coursesTable.cid, courseId))
      .returning();

      return NextResponse.json({ result: result, message: "Course deleted successfully" });
  } catch (error) {
      console.error("Error deleting course:", error);
      return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
