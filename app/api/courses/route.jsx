import { db } from "@/config/db";
import { desc, eq, ne, sql, ilike, or } from "drizzle-orm";
import {
  coursesTable,
  enrollCourseTable,
  chapterQuizzes,
  userAnalyticsTable,
} from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const search = searchParams?.get('search') || '';

  const user = await currentUser();

  if (courseId == "0") {
    // Base condition
    const baseCondition = sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`;

    // Search condition
    const searchCondition = search ? or(
      ilike(coursesTable.name, `%${search}%`),
      sql`${coursesTable.courseContent}->'course'->>'description' ILIKE ${`%${search}%`}`,
      ilike(coursesTable.author, `%${search}%`)
    ) : null;

    const finalCondition = searchCondition ? sql`${baseCondition} AND ${searchCondition}` : baseCondition;

    // Fetch total count for pagination metadata
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(coursesTable).where(finalCondition);
    const totalCount = totalCountResult[0].count;

    const result = await db.select().from(coursesTable)
      .where(finalCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(coursesTable.id));

    return NextResponse.json({
      data: result,
      pagination: {
        totalCount: Number(totalCount),
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  }
  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));
    // console.log(result);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } else {
    // Base condition for user courses
    const baseCondition = eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress);

    // Search condition
    const searchCondition = search ? or(
      ilike(coursesTable.name, `%${search}%`),
      sql`${coursesTable.courseContent}->'course'->>'description' ILIKE ${`%${search}%`}`
    ) : null;

    const finalCondition = searchCondition ? sql`${baseCondition} AND ${searchCondition}` : baseCondition;

    // Fetch total count for the user
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(coursesTable).where(finalCondition);
    const totalCount = totalCountResult[0].count;

    const result = await db.select().from(coursesTable)
      .where(finalCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(coursesTable.id));

    return NextResponse.json({
      data: result,
      pagination: {
        totalCount: Number(totalCount),
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const user = await currentUser();

  if (!courseId) {
    return NextResponse.json(
      { error: "Course ID is required" },
      { status: 400 },
    );
  }

  try {
    // 1. Verify user owns the course
    const course = await db
      .select()
      .from(coursesTable)
      .where(
        sql`${coursesTable.cid} = ${courseId} AND ${coursesTable.userEmail} = ${user?.primaryEmailAddress?.emailAddress}`,
      );

    if (!course || course.length === 0) {
      return NextResponse.json(
        { error: "Course not found or unauthorized" },
        { status: 404 },
      );
    }

    // 2. Delete from enrollCourseTable
    await db
      .delete(enrollCourseTable)
      .where(eq(enrollCourseTable.cid, courseId));

    // 3. Delete from chapterQuizzes
    await db
      .delete(chapterQuizzes)
      .where(eq(chapterQuizzes.courseId, courseId));

    // 4. Delete from userAnalyticsTable
    await db
      .delete(userAnalyticsTable)
      .where(eq(userAnalyticsTable.courseId, courseId));

    // 5. Delete from coursesTable (Primary)
    await db.delete(coursesTable).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
