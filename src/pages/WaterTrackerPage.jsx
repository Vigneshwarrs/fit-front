import React from 'react'
import HydrationTracker from '../components/trackers/water/WaterTracker'
import WaterChart from '../components/trackers/water/WaterChart'

function WaterTrackerPage() {
  return (
    <div>
        <HydrationTracker />
        <WaterChart />
    </div>
  )
}

export default WaterTrackerPage