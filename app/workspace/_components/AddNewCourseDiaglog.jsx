'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

function AddNewCourseDiaglog({ children }) {
  // Normalize children and pick the first valid React element so Radix's
  // DialogTrigger (when used with `asChild`) always receives exactly one
  // element. This avoids errors caused by surrounding whitespace/text nodes.
  const childElement = React.Children.toArray(children).find((c) =>
    React.isValidElement(c)
  )
 const [loading, setLoading]= useState(false);
  const [formData, setFormData]= useState({
    name:'',
    description:'',
    includeVideo:false,
    noOfChapters:1,
    category:'',
    level:'',
  });
  const router = useRouter();
  const onHandleInputChange=(field,value)=>{
    setFormData(prev=>({
      ...prev,[field]:value
    }) )
    console.log(formData)
  }
  const onGenarate= async()=>{
    console.log(formData)
    const courseId=uuidv4();
    try{

    
    setLoading(true);
    const  result = await axios.post('/api/generate-course-layout',{...formData,
      courseId:courseId

    });
    console.log(result.data)
    setLoading(false)
    router.push('/workspace/edit-course/'+result.data?.courseId);
  }
  catch(e){
    setLoading(false)
    console.log(e)
  }
  }

  return (
    <Dialog>
      {childElement ? (
        <DialogTrigger asChild>{childElement}</DialogTrigger>
      ) : (
        // Fallback trigger if no valid child was provided
        <DialogTrigger>
          <button className="inline-flex items-center rounded-md px-3 py-2">
            Open
          </button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course using AI  </DialogTitle>
          <DialogDescription asChild>
         <div className=' flex flex-col gap-4 mt-3'>
       <div>
        <label>
          Course Name
        </label>
        <Input placeholder="Enter course name" onChange={(event)=>onHandleInputChange('name',event?.target.value)} />
  
          </div>
            <div>
        <label>
          Course Description (optional)
        </label>
        <Textarea  placeholder="Course Description"onChange={(event)=>onHandleInputChange('description',event?.target.value)}  />
  
          </div>
            <div>
        <label>
          Number of Chapters
        </label>
        <Input placeholder="Enter number the of Chapters"  type="number" onChange={(event)=>onHandleInputChange('noOfChapters',event?.target.value)} />
  
          </div>
          <div className=' flex gap-3 items-center'>
            <label> Include video</label>
            <Switch    
                      onCheckedChange={()=>onHandleInputChange('includeVideo',!formData?.includeVideo)}/>
          </div>
          <div>
            <label>Difficulty  Level</label>
            <Select className='mt-1' onValueChange={(value)=>onHandleInputChange('level',value)}>
  <SelectTrigger className="w-full">
    <SelectValue  className="" placeholder="Diificulty Level" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="beginner">Beginner</SelectItem>
    <SelectItem value="moderate">Moderate</SelectItem>
    <SelectItem value="advanced">Advanced</SelectItem>
  </SelectContent>
</Select>
          </div>
             <div>
        <label>
          Category
        </label>
        <Input placeholder="Category  (Separated by comma)"  onChange={(event)=>onHandleInputChange('category',event?.target.value)}  />
   
          </div>
          <div>
            <Button onClick={onGenarate}  disabled={loading} className="mt-5 w-full">
              {loading?<Loader2Icon className='animate-spin' /> :     <Sparkle />}
          Generate Course
            </Button>
          </div>
         </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewCourseDiaglog