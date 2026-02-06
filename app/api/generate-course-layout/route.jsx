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
  
    const model = 'gemini-3-flash-preview';
  
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
  try {
    if (!imagePrompt) {
      console.error("No image prompt provided");
      return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1024&h=1024&fit=crop';
    }

    // Try Pollinations AI first
    const pollinationsResult = await tryPollinations(imagePrompt);
    if (pollinationsResult) return pollinationsResult;

    // Try alternative service as fallback
    console.log('Pollinations failed, trying alternative service...');
    const alternativeResult = await tryAlternativeService(imagePrompt);
    if (alternativeResult) return alternativeResult;

    console.warn("All image generation services failed. Using Unsplash placeholder.");
    throw new Error("All image generation services failed");
  } catch (error) {
    console.error("Image generation failed:", error.message);
    // Fallback to aesthetic placeholder from Unsplash
    return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1024&h=1024&fit=crop';
  }
};

const tryPollinations = async (imagePrompt) => {
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    
    // List of models to try
    const models = ['flux', 'turbo'];
    
    for (const model of models) {
      try {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=${model}`;
        console.log(`Trying Pollinations model ${model}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: { 'Accept': 'image/*' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`Pollinations ${model} failed: ${response.status}`);
          if (response.status === 502 || response.status === 503) {
            console.warn('Pollinations API is down. Skipping remaining models.');
            return null;
          }
          continue;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.startsWith('image/')) {
          console.warn(`Non-image response from ${model}`);
          continue;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength < 1000) {
          console.warn(`Invalid image size from ${model}`);
          continue;
        }

        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
        
        console.log(`✓ Pollinations ${model} succeeded (${Math.round(base64Image.length / 1024)} KB)`);
        return base64Image;
      } catch (err) {
        if (err.name === 'AbortError') {
          console.error(`Pollinations ${model} timed out`);
        } else {
          console.error(`Pollinations ${model} error:`, err.message);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Pollinations service error:', error.message);
    return null;
  }
};

const tryAlternativeService = async (imagePrompt) => {
  try {
    // Use via.placeholder.com as a simple fallback
    const cleanPrompt = imagePrompt.substring(0, 100);
    const encodedText = encodeURIComponent('Course Banner');
    
    console.log('Trying alternative image service...');
    
    const fallbackUrl = `https://via.placeholder.com/1024x1024/4f46e5/ffffff?text=${encodedText}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(fallbackUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Alternative service failed:', response.status);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
    
    console.log('✓ Alternative service succeeded');
    return base64Image;
  } catch (error) {
    console.error('Alternative service error:', error.message);
    return null;
  }
};
