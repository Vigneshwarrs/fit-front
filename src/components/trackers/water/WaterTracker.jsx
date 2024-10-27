import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  Button, 
  Slider, 
  Grid, 
  Typography, 
  Tooltip, 
  Alert, 
  CircularProgress,
  Box,
  Paper,
  Container,
  useTheme,
  styled,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { WaterDrop, Add, Remove } from '@mui/icons-material';
import { incrementGlass, decrementGlass, setGoal, setDate, updateWaterIntake, fetchWaterHistory } from '../../../redux/slice/waterSlice';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const WaterIntakeBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ProgressSlider = styled(Slider)(({ theme }) => ({
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    display: 'none',
  },
}));

export default function HydrationTracker() {
  const dispatch = useDispatch();
  const theme = useTheme();
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            align="center" 
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Daily Hydration Tracker
          </Typography>

          {/* Date Selection */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <DatePicker
              value={new Date(currentDay.date)}
              onChange={(date) => dispatch(setDate(date))}
              sx={{ 
                '& .MuiInputBase-root': { 
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default 
                }
              }}
            />
          </Box>

          {/* Water Intake Counter */}
          <WaterIntakeBox elevation={2}>
            <IconButton 
              onClick={() => dispatch(decrementGlass())}
              disabled={currentDay.glassCount <= 0}
              size="large"
            >
              <Remove />
            </IconButton>
            
            <Tooltip title={`${totalWaterIntake}ml consumed`} arrow placement="top">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WaterDrop sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {currentDay.glassCount}
                </Typography>
              </Box>
            </Tooltip>

            <IconButton 
              onClick={() => dispatch(incrementGlass())}
              size="large"
              color="primary"
            >
              <Add />
            </IconButton>
          </WaterIntakeBox>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Daily Progress: {currentDay.glassCount} / {currentDay.goal} glasses
            </Typography>
            <ProgressSlider
              value={progressPercentage}
              aria-labelledby="progress-slider"
              max={100}
              disabled
              sx={{
                '& .MuiSlider-track': {
                  backgroundColor: theme.palette.primary.main,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            />
          </Box>

          {/* Goal Setter */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Set Daily Goal (glasses):
            </Typography>
            <Slider
              value={currentDay.goal}
              onChange={(e, value) => dispatch(setGoal(value))}
              max={15}
              min={1}
              step={1}
              valueLabelDisplay="on"
              color="primary"
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatBox elevation={1}>
                <Typography variant="h4" color="primary">
                  {stats.weeklyAverage.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weekly Average
                </Typography>
              </StatBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatBox elevation={1}>
                <Typography variant="h4" color="primary">
                  {stats.monthlyAverage.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Average
                </Typography>
              </StatBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatBox elevation={1}>
                <Typography variant="h4" color="primary">
                  {stats.bestStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best Streak
                </Typography>
              </StatBox>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            disabled={loading}
            size="large"
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Progress'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 2,
              }}
              variant="filled"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Error
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </StyledCard>
    </Container>
  );
}