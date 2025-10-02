import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function GET(req){

    const { searchParams} = new URL (req.url);
     const courseId = searchParams.get('courseId');

     const result = await  db.select().from(coursesTable).where(eq(coursesTable.cid,courseId));
console.log(result);

     return NextResponse.json(result[0]);
}