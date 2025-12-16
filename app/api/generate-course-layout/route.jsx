import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { uuid } from 'drizzle-orm/gel-core';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';


     const PROMPT=`Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",

"bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
     
      }
    ]
  }
}

, User Input: 

`
  export const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
export async function POST(req) {
  try {
    const {courseId,...formData} = await req.json();
    const user = await currentUser();

  
  
    const config = {
      responseMimeType: 'text/plain',
    };
  
    const model = 'gemini-2.5-flash';
    //  const model = 'gemini-2.5-pro';
  
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: PROMPT+JSON.stringify(formData),
          },
        ],
      },
    ];
  
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
  
    console.log('AI raw response:', response.candidates[0].content.parts[0].text);
    const RawResp =response?.candidates[0]?.content?.parts[0]?.text
    const RawJson=RawResp.replace('```json','').replace('```','');
    let JSONResp;
    try {
      JSONResp=JSON.parse(RawJson);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', RawJson, parseError);
      throw new Error('AI response was not valid JSON.');
    }

    const ImagePrompt = JSONResp.course?.bannerImagePrompt

    const bannerImageUrl = await GenerateImage(ImagePrompt);

    // save to database
    const result=  await db.insert(coursesTable).values({
      ...formData,
        courseJson:JSONResp,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        cid:courseId,
        bannerImageUrl :   bannerImageUrl 
    });
    return NextResponse.json({courseId:courseId});
  } catch (error) {
    console.error('Error in generate-course-layout:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
     
const GenerateImage = async (imagePrompt) => {
  const width = 1024;
  const height = 1024;
  const fallbackPrompt =
    'Modern digital education illustration vibrant flat 2d ui elements';
  const safePrompt = encodeURIComponent(imagePrompt?.trim() || fallbackPrompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=${width}&height=${height}&nologo=true`;

  const response = await fetch(pollinationsUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to fetch banner image from Pollinations');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'image/png';
  return `data:${contentType};base64,${buffer.toString('base64')}`;
};