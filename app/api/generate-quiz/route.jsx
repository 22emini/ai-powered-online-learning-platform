
import { NextResponse } from "next/server";

import { db } from "@/config/db";
import { chapterQuizzes } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { ai } from "../generate-course-layout/route";

const PROMPT = `
Generate a quiz with 10 multiple-choice questions based on the provided chapter content.
For each question, provide 4 options and identify the correct answer.

Output strictly in JSON format matching the following schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string"
    }
  ]
}

Chapter Content:
`;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { courseId, chapterId, chapterContent } = body ?? {};

    if (!courseId || (chapterId === undefined || chapterId === null) || !chapterContent) {
      return NextResponse.json({ error: 'Missing required fields: courseId, chapterId, chapterContent' }, { status: 400 });
    }

    // Check if quiz already exists
    /* 
    // Optional: caching check. For now, we generate fresh or user can use get-quiz
    const existing = await db.select().from(chapterQuizzes)
      .where(and(eq(chapterQuizzes.courseId, courseId), eq(chapterQuizzes.chapterId, chapterId)));
    
    if (existing.length > 0) {
      return NextResponse.json(existing[0].content);
    }
    */

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const config = { responseMimeType: "text/plain" };
    const contents = [
      {
        role: 'user',
        parts: [
          { text: PROMPT + (typeof chapterContent === 'string' ? chapterContent : JSON.stringify(chapterContent)) },
        ],
      },
    ];

    const response = await ai.models.generateContent({ model, config, contents });

    const rawContent = response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!rawContent) {
      console.error('AI returned empty response', response);
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // strip fences if present and parse
    const cleaned = String(rawContent).replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    let jsonContent;

    try {
      jsonContent = typeof cleaned === 'object' ? cleaned : JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse AI response as JSON:', parseErr, 'raw:', cleaned);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 });
    }

    // Basic validation
    if (!jsonContent || !Array.isArray(jsonContent.questions)) {
      return NextResponse.json({ error: 'AI response has unexpected schema' }, { status: 502 });
    }

    // Save to DB
    await db.insert(chapterQuizzes).values({
      courseId: String(courseId),
      chapterId: Number(chapterId),
      content: jsonContent,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true, content: jsonContent }, { status: 201 });

  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
