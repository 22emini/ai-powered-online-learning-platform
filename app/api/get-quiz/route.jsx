
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { chapterQuizzes } from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { courseId, chapterId } = body ?? {};

    if (!courseId || (chapterId === undefined || chapterId === null)) {
      return NextResponse.json({ error: "Missing required fields: courseId and chapterId" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(chapterQuizzes)
      .where(
        and(
          eq(chapterQuizzes.courseId, String(courseId)),
          eq(chapterQuizzes.chapterId, Number(chapterId))
        )
      );

    if (!result || result.length === 0) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({ found: true, content: result[0].content }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
