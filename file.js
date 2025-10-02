// import { db } from '@/config/db';
// import { coursesTable } from '@/config/schema';
// import { currentUser } from '@clerk/nextjs/server';

// import {
//        GoogleGenAI,
//      } from '@google/genai';
// import { uuid } from 'drizzle-orm/gel-core';
// import { NextResponse } from 'next/server';


//      const PROMPT=`Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

// Schema:

// {
//   "course": {
//     "name": "string",
//     "description": "string",
//     "category": "string",
//     "level": "string",
//     "includeVideo": "boolean",
//     "noOfChapters": "number",

// "bannerImagePrompt": "string",
//     "chapters": [
//       {
//         "chapterName": "string",
//         "duration": "string",
//         "topics": [
//           "string"
//         ],
     
//       }
//     ]
//   }
// }

// , User Input: 

// `
// export async function POST(req) {
//   try {
//     const { courseId, ...formData } = await req.json();
//     const user = await currentUser();

//     if (!process.env.GEMINI_API_KEY) {
//       console.error('Missing GEMINI_API_KEY');
//       return NextResponse.json({ error: 'Server misconfiguration: missing GEMINI_API_KEY' }, { status: 500 });
//     }

//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const config = {
//       responseMimeType: 'text/plain',
//     };

//     const model = 'gemini-2.0-flash';

//     const contents = [
//       {
//         role: 'user',
//         parts: [
//           {
//             text: PROMPT + JSON.stringify(formData),
//           },
//         ],
//       },
//     ];

//     const response = await ai.models.generateContent({ model, config, contents });

//     // Defensive checks for the AI response structure
//     const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!rawText || typeof rawText !== 'string') {
//       console.error('AI response missing expected text:', response);
//       return NextResponse.json({ error: 'AI returned an unexpected response' }, { status: 500 });
//     }

//     console.log('AI raw response:', rawText);

//     // Try to extract a JSON object from the AI reply. The model may include markdown fences or extra text.
//     let jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

//     // If that didn't produce valid JSON, try to extract text between the first { and the last }
//     if (!jsonString.startsWith('{')) {
//       const first = rawText.indexOf('{');
//       const last = rawText.lastIndexOf('}');
//       if (first !== -1 && last !== -1 && last > first) {
//         jsonString = rawText.substring(first, last + 1);
//       }
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(jsonString);
//     } catch (parseErr) {
//       console.error('Failed to parse AI JSON:', parseErr, 'extracted:', jsonString);
//       return NextResponse.json({ error: 'Failed to parse AI response as JSON', details: parseErr.message }, { status: 500 });
//     }

//     // save to database
//     const result = await db.insert(coursesTable).values({
//       ...formData,
//       courseJson: parsed,
//       userEmail: user?.primaryEmailAddress?.emailAddress,
//       cid: courseId,
//     });

//     return NextResponse.json({ courseId: courseId });
//   } catch (err) {
//     console.error('Unhandled error in /api/generate-course-layout:', err);
//     const message = err?.message || String(err);
//     return NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 });
//   }
//      }
     
// // url for testing
// http://localhost:3000/workspace/edit-course/83b233fb-0ae4-4d62-9465-52e2b088d43e
// import {
//   GoogleGenAI,
// } from '@google/genai';

// async function main() {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });

//   const config = {
//     responseMimeType: 'text/plain',
//   };

//   const model = 'gemini-2.0-flash';

//   const contents = [
//     {
//       role: 'user',
//       parts: [
//         {
//           text: 'INSERT_INPUT_HERE',
//         },
//       ],
//     },
//   ];

//   const response = await ai.models.generateContentStream({
//     model,
//     config,
//     contents,
//   });

//   for await (const chunk of response) {
//     console.log(chunk.text);
//   }
// }

// main();
