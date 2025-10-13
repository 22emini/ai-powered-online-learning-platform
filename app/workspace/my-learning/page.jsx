import React from 'react'
import WelcomeBanner from '../_components/WelcomeBanner'
import EnrollCourseList from '../_components/EnrollCourseList'

const Mylearning = () => {
  return (
    <div>
      <WelcomeBanner />
        <h2 className=' font-bold text-3xl mt-7'>  Continue Learning Your Courses</h2>
        <EnrollCourseList />
    </div>
  )
}

export default Mylearning
