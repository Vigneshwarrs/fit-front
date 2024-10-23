import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutChart from '../components/workout/WorkoutChart';
import WorkoutSummary from '../components/workout/WorkoutSummary';

function WorkoutPage() {
  return (
    <Box p={4}>
      <Grid container spacing={4}  style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Workout
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Fill out the form below to log your workout details.
              </Typography>
              <WorkoutForm />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Workout Progress
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Track your workout progress with the chart below.
              </Typography>
              <WorkoutSummary />
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={6} >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Workout Progress
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Track your workout progress with the chart below.
              </Typography>
              <WorkoutChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WorkoutPage;
