"use client"
import { SelectChapterIndexContext } from '@/context/SelectChapterIndexContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserProgressContext } from '@/app/context/UserProgressContext'

function Provider({ children }) {
  const { user } = useUser();
  const [ userDetail , setUserDetail ] = useState();
  const [ selectedChapterIndex,setSelectedChapterIndex]= useState(0);
  const [userProgress, setUserProgress] = useState({ totalXP: 0, level: 1 });

  const fetchUserProgress = async () => {
    try {
      const result = await axios.get('/api/analytics');
      const xp = result.data.totalXP || 0;
      const level = Math.floor(xp / 1000) + 1;
      setUserProgress({ totalXP: xp, level: level });
    } catch (error) {
      console.error("Failed to fetch user progress", error);
    }
  }

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
    if (user) {
      CreateNewUser();
      fetchUserProgress();
    }
  }, [user]);

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <SelectChapterIndexContext.Provider value={{ selectedChapterIndex,setSelectedChapterIndex}}>
        <UserProgressContext.Provider value={{ ...userProgress, refreshProgress: fetchUserProgress }}>
          <div>
            {children}
          </div>
        </UserProgressContext.Provider>
      </SelectChapterIndexContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider
