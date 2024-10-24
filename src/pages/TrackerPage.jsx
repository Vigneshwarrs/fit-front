import React from "react";
import HydrationTracker from "../components/trackers/water/WaterTracker";
import SleepTracker from "../components/trackers/sleep/SleepTracker";
import SleepChart from "../components/trackers/sleep/SleepChart";
import WeightTracker from "../components/trackers/weight/WeightTracker";
import WaterChart from "../components/trackers/water/WaterChart";
import { Box, Grid, Card, CardContent } from "@mui/material";

function TrackerPage() {
  return (
    <div>
      <Box p={4}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
          <HydrationTracker />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <WaterChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <SleepTracker />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <SleepChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <WeightTracker />
            </CardContent>
          </Card>
        </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default TrackerPage;
