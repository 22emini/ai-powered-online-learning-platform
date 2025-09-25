import React from 'react'
import WorkSpaceProvider from './provider'

const WorkSpacelayout = ({children}) => {
  return (
   
    <WorkSpaceProvider>
        {children}
    </WorkSpaceProvider>
  )
}

export default WorkSpacelayout