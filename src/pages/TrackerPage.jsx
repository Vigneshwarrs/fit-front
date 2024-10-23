import React from "react";
import HydrationTracker from "../components/trackers/water/WaterTracker";
import SleepTracker from "../components/trackers/sleep/SleepTracker";
import SleepChart from "../components/trackers/sleep/SleepChart";
import WeightTracker from "../components/trackers/weight/WeightTracker";
import WaterChart from "../components/trackers/water/WaterChart";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";

function TrackerPage() {
  return (
    <div>
      <Box p={4}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
          <HydrationTracker />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
              <WaterChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
              <SleepTracker />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
              <SleepChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
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
