"use client"
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
// this function is used store new user inside database
function Provider({ children }) {
  const { user } = useUser();
  const [ userDetail , setUserDetail ] = useState();
  const [ selectedChapterIndex,setSelectedChapterIndex]= useState(0);
  const CreateNewUser = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();
      setUserDetail(data);
      console.log(data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  useEffect(() => {
    user && CreateNewUser();
  }, [user]);
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <SelectChapterIndexContext.Provider value={{ selectedChapterIndex,setSelectedChapterIndex}}>
 <div>
      {children}
    </div>
    </SelectChapterIndexContext.Provider>
    </UserDetailContext.Provider>
   
  );
}

export default Provider
