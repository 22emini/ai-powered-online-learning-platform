import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST (req){
   try {
      const body = await req.json();
      const { courseId } = body ?? {};

      if (!courseId) {
         return NextResponse.json({ error: "courseId is required" }, { status: 400 });
      }

      const user = await currentUser();
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) {
         return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
      }

      const enrollCourses = await db
         .select()
         .from(enrollCourseTable)
         .where(and(eq(enrollCourseTable.userEmail, userEmail), eq(enrollCourseTable.cid, courseId)));

      if (enrollCourses?.length > 0) {
         return NextResponse.json({ resp: "Already Enrolled" }, { status: 200 });
      }

      const result = await db
         .insert(enrollCourseTable)
         .values({ cid: courseId, userEmail })
         .returning(enrollCourseTable);

      return NextResponse.json({ resp: "Enrolled Successfully", data: result }, { status: 201 });
   } catch (error) {
      console.error("Error in enroll-course route:", error);
      return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
   }
}

export async function GET (req){
 const user =  await currentUser();

    const { searchParams} = new URL (req.url);
     const courseId = searchParams?.get('courseId');

     if(courseId){
    const  result = await db.select().from(coursesTable)
    .innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid))
    .where(and(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress),eq(enrollCourseTable.cid,courseId)))
    
    return NextResponse.json(result[0])
     }
 else{
    const  result = await db.select().from(coursesTable)
    .innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid))
    .where(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(enrollCourseTable.id));

    
          return NextResponse.json(result)
 }
    const  result = await db.select().from(coursesTable)
    .innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid))
    .where(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(enrollCourseTable.id));

      // debug: log shape so frontend can normalize correctly
      try {
         console.log('[enroll-course GET] rows:', Array.isArray(result) ? result.length : 0);
         if (Array.isArray(result) && result.length > 0) {
            // show keys of first row to help identify shape
            console.log('[enroll-course GET] sample keys:', Object.keys(result[0] || {}).slice(0, 20));
         }
      } catch (e) {
         console.error('[enroll-course GET] logging failed', e);
      }

      return NextResponse.json(result)
}