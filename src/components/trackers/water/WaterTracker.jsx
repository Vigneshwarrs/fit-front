import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, Button, Slider, Grid, Typography, Tooltip, Alert, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { WaterDrop } from '@mui/icons-material';
import { incrementGlass, decrementGlass, setGoal, setDate, updateWaterIntake, fetchWaterHistory } from '../../../redux/slice/waterSlice';
//
export default function HydrationTracker() {
  const dispatch = useDispatch();
  const { currentDay, loading, error, stats } = useSelector((state) => state.water);
  
  useEffect(() => {
    dispatch(fetchWaterHistory());
  }, [dispatch]);

  const progressPercentage = (currentDay.glassCount / currentDay.goal) * 100;
  const totalWaterIntake = currentDay.glassCount * 250; // ml per glass

  const handleSave = async () => {
    await dispatch(updateWaterIntake(currentDay));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', spaceBetween: '24px' }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold">
              Daily Hydration Tracker
            </Typography>
          }
        />
        <CardContent>
          {/* Date Selection */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <DatePicker
              date={currentDay.date}
              onChange={(date) => dispatch(setDate(date))}
            />
          </div>

          {/* Water Intake Counter */}
          <div style={{ backgroundColor: '#e0f7fa', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>
            <Button
              variant="outlined"
              onClick={() => dispatch(decrementGlass())}
              disabled={currentDay.glassCount <= 0}
              sx={{ marginRight: '8px' }}
            >
              -
            </Button>
            <Tooltip title={`${totalWaterIntake}ml consumed`} arrow>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <WaterDrop style={{ fontSize: '32px', color: '#0288d1' }} />
                <Typography variant="h3" style={{ marginLeft: '8px', color: '#0288d1' }}>
                  {currentDay.glassCount}
                </Typography>
              </div>
            </Tooltip>
            <Button
              variant="outlined"
              onClick={() => dispatch(incrementGlass())}
              sx={{ marginLeft: '8px' }}
            >
              +
            </Button>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="body2" color="textSecondary">
              Daily Progress: {currentDay.glassCount} / {currentDay.goal} glasses
            </Typography>
            <Slider
              value={progressPercentage}
              aria-labelledby="progress-slider"
              max={100}
              disabled
              sx={{ marginTop: '8px' }}
            />
          </div>

          {/* Goal Setter */}
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="body2" color="textSecondary">
              Set Daily Goal (glasses):
            </Typography>
            <Slider
              value={currentDay.goal}
              onChange={(e, value) => dispatch(setGoal(value))}
              max={15}
              min={1}
              step={1}
              valueLabelDisplay="on"
              sx={{ marginTop: '16px' }}
            />
          </div>

          {/* Statistics */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" align="center">{stats.weeklyAverage.toFixed(1)}</Typography>
              <Typography variant="body2" color="textSecondary" align="center">Weekly Avg</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="center">{stats.monthlyAverage.toFixed(1)}</Typography>
              <Typography variant="body2" color="textSecondary" align="center">Monthly Avg</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="center">{stats.bestStreak}</Typography>
              <Typography variant="body2" color="textSecondary" align="center">Best Streak</Typography>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            disabled={loading}
            sx={{ marginTop: '16px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Progress'}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ marginTop: '16px' }}>
              <Typography variant="h6">Error</Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
