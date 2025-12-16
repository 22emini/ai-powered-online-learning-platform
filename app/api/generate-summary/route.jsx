import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";

export async function POST(req) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const prompt = `Summarize the following text concisely:\n\n${text}`;

    const config = { responseMimeType: "text/plain" };
    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({ model, config, contents });
    const summary = response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!summary) {
      throw new Error("No summary generated");
    }

    return NextResponse.json({ result: summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment before trying again." }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
