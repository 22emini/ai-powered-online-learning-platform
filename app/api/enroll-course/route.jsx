import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc, sql } from "drizzle-orm";
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
  const user = await currentUser();
  const { searchParams} = new URL (req.url);
  const courseId = searchParams?.get('courseId');
  const page = parseInt(searchParams?.get('page')) || 1;
  const limit = parseInt(searchParams?.get('limit')) || 10;
  const offset = (page - 1) * limit;

  if (!user || !user.primaryEmailAddress) {
    return NextResponse.json({ data: [], pagination: { totalCount: 0, totalPages: 0, currentPage: 1, pageSize: limit } }, { status: 200 });
  }

  if(courseId){
    const result = await db.select().from(coursesTable)
    .innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid))
    .where(and(eq(enrollCourseTable.userEmail,user.primaryEmailAddress.emailAddress),eq(enrollCourseTable.cid,courseId)))
    
    return NextResponse.json(result[0])
  } else {
    // Total count for pagination
    const totalCountResult = await db.select({ count: sql`count(*)` })
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress));
    
    const totalCount = totalCountResult[0].count;

    const result = await db.select().from(coursesTable)
      .innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail,user.primaryEmailAddress.emailAddress))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(enrollCourseTable.id));

    return NextResponse.json({
      data: result,
      pagination: {
        totalCount: Number(totalCount),
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit
      }
    })
  }
}

export async function PUT (req){

 const {completedChapter,courseId} = await req.json();
 const user = await currentUser();

 const result = await db.update(enrollCourseTable)
   .set({ completedChapters: completedChapter })
   .where(
     and(
       eq(enrollCourseTable.cid, courseId),
       eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress)
     )
   ).returning(enrollCourseTable)

   return NextResponse.json(result)
}