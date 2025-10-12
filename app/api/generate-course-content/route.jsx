 import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { asc, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";

 const PROMPT =`
Depends on Chapter name and Topic Generate content for each topic in HTML 

and give response in JSON format. 

Schema:{

chapterName:<>,

{

topic:<>,

content:<>

}

}

: User Input:

`
export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (!courseJson?.chapters || !Array.isArray(courseJson.chapters)) {
      return NextResponse.json({ error: 'Invalid courseJson.chapters' }, { status: 400 });
    }

    const promises = courseJson.chapters.map(async (chapter) => {
      const config = {
        responseMimeType: 'text/plain',
      };

      const model = 'gemini-2.0-flash';

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      console.log('AI raw response for chapter', chapter.name ?? chapter.chapterName ?? '[unknown]:', raw);

      // strip possible ```json fences and surrounding whitespace
      const rawJson = raw.replace(/```json\s*/i, '').replace(/```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(rawJson);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON for chapter:', chapter, '\nraw:', rawJson, parseError);
        // As a fallback, return the raw text so we don't lose the chapter
        parsed = { parseError: 'invalid JSON from AI', raw: raw };
      }

    const youtubeData= await GetYoutubeVideo(chapter?.chapterName);

      return {
 youtubeVideo:youtubeData,
 CourseContent: parsed ,

      };
    });



    const CourseContent = await Promise.all(promises);

      const dbResp = await db.update(coursesTable).set({
          courseContent: CourseContent,
        }).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      CourseContent: CourseContent,
    });
  } catch (err) {
    console.error('Error in generate-course-content POST:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}



 const YOUTUBE_BASE_URL=' https://www.googleapis.com/youtube/v3/search'
const GetYoutubeVideo= async(topic)=>{
  const params={
part:'snippet',
q:topic,
maxResult:4,
type:'video',
key:process.env.YOUTUBE_API_KEY 
  }
  const resp = await axios.get(YOUTUBE_BASE_URL,{params})
  
  const  youtubeVideoListResp=resp.data.items;
  
  const  youtubeVideoList=[];

 youtubeVideoListResp.forEach(item=>{
   const  data ={
     videoId:item.id?.videoId,
     title:item?.snippet?.title
   }
   youtubeVideoList.push(data);
 })
 console.log("youtubeVideoList", youtubeVideoList)
  return youtubeVideoList
  
}
