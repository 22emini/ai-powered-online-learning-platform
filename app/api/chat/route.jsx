import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { ai } from "../generate-course-layout/route";

export async function POST(req) {
  try {
    const { messages, courseId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL ||  'gemini-3-flash-preview';

    let systemPrompt = "You are a helpful and knowledgeable AI tutor. You help students with their courses and questions. Keep answers concise and helpful.";

    if (courseId) {
      try {
        const courses = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId));
        const course = courses[0];
        
        if (course) {
           systemPrompt += `\n\nCONTEXT:\nYou are currently assisting the user with the course: "${course.name}".\n`;
           if (course.description) {
             systemPrompt += `Course Description: ${course.description}\n`;
           }
           // Try to add chapter context if available
           if (course.courseJson) {
              // Assuming courseJson might be an object or string, try to include relevant parts
              // If it's the structure from the screenshot, it has chapters.
              const jsonContent = typeof course.courseJson === 'string' ? JSON.parse(course.courseJson) : course.courseJson;
               if (jsonContent) {
                  systemPrompt += `Course Structure/Content: ${JSON.stringify(jsonContent, null, 2)}\n`;
               }
           }
           systemPrompt += "\nPlease use this context to answer the user's questions about the course specifically.";
        }
      } catch (dbError) {
        console.error("Error fetching course context:", dbError);
        // Continue without context if fetch fails
      }
    }

    // Combine system + user messages into a single prompt and use SDK like generate-course-layout
    const combinedPromptParts = [systemPrompt];
    for (const m of messages) {
      const role = m.role || 'user';
      combinedPromptParts.push(`\n${role.toUpperCase()}: ${m.content}`);
    }
    const prompt = combinedPromptParts.join('\n');

    const config = { responseMimeType: 'text/plain' };
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({ model, config, contents });
    const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ result: responseText });

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
