import React from 'react';
import { 
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Divider
} from '@mui/material';
import SleepForm from '../components/trackers/sleep/SleepTracker';
import SleepChart from '../components/trackers/sleep/SleepChart';

function SleepTrackerPage() {
  return (
    <Container className="py-8">
      <Paper className="p-6">
        <Box className="mb-6">
          <Typography variant="h4" className="text-2xl font-bold mb-2">
            Sleep Tracker
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Monitor and analyze your sleep patterns to improve your rest quality
          </Typography>
        </Box>

        <Divider className="my-6" />

        <Grid container spacing={4}>
          {/* Sleep Form Section */}
          <Grid item xs={12} md={5}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4 font-semibold">
                Log Your Sleep
              </Typography>
              <SleepForm />
            </Paper>
          </Grid>

          {/* Sleep Chart Section */}
          <Grid item xs={12} md={7}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4 font-semibold">
                Sleep Analysis
              </Typography>
              <SleepChart />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default SleepTrackerPage;