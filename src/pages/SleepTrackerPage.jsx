import React from 'react'
import SleepForm from '../components/trackers/sleep/SleepTracker'
import SleepChart from '../components/trackers/sleep/SleepChart'

function SleepTrackerPage() {
  return (
    <>
      Sleep Tracker Page
      <SleepForm />
      <SleepChart />
    </>
  )
}

export default SleepTrackerPage;