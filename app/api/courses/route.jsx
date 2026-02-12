import { db } from "@/config/db";
import { desc, eq, ne, sql } from "drizzle-orm";
import { coursesTable } from "@/config/schema";
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
