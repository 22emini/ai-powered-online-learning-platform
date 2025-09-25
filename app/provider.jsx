"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
// this function is used store new user inside database
function Provider({ children }) {
  const { user } = useUser();
  const [ userDetail , setUserDetail ] = useState();
  const CreateNewUser = async () => {
    const result = await axios.post('/api/user', {
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
    });
    setUserDetail(result.data)
    console.log(result.data);
  };
  useEffect(() => {
    user && CreateNewUser();
  }, [user]);
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
 <div>
      {children}
    </div>
    </UserDetailContext.Provider>
   
  );
}

export default Provider
