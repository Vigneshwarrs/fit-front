import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getWorkouts } from '../../services/workoutService';
import {
  Typography,
  CircularProgress,
  Grid,
  Button,
  Snackbar,
  Box,
  CssBaseline,
  Alert,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    format, 
    subDays, 
    subWeeks, 
    subMonths, 
    eachDayOfInterval, 
    eachWeekOfInterval, 
    eachMonthOfInterval, 
    isAfter,
    parseISO 
  } from 'date-fns';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StyledButton = styled(Button)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : theme.palette.background.default,
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'capitalize',
  padding: theme.spacing(1, 2),
}));

const WorkoutChart = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('lastWeek');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  const fetchWorkoutData = async (dateRange) => {
    try {
      const response = await getWorkouts();
      const workoutLogs = response.data;

      const filteredLogs = workoutLogs.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= dateRange[0] && logDate <= dateRange[1];
      });

      return filteredLogs;
    } catch (error) {
      setError('Error fetching workout data. Please try again later.');
      setLoading(false);
      setSnackbarOpen(true);
      return [];
    }
  };

  const getDateRange = useMemo(() => (filter) => {
    const today = new Date();
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    switch (filter) {
      case 'lastWeek':
        return [subDays(endOfToday, 6), endOfToday];
      case 'lastMonth':
        return [subWeeks(today, 4), endOfToday];
      case 'last6Months':
        return [subMonths(today, 6), endOfToday];
        case 'custom':
            return [customStartDate ? parseISO(customStartDate) : null, 
                    customEndDate ? parseISO(customEndDate) : null];
      default:
        return [subDays(endOfToday, 6), endOfToday];
    }
  }, [customStartDate, customEndDate]);

  const getChartOptions = useMemo(() => (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        color: theme.palette.text.primary,
        font: {
          size: isMobile ? 14 : 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} kcal`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !isMobile,
          text: 'Calories',
          color: theme.palette.text.secondary,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: isMobile ? 90 : 45,
          minRotation: isMobile ? 90 : 45,
          font: {
            size: isMobile ? 8 : 10,
          },
        },
      },
    },
  }), [theme, isMobile]);

  useEffect(() => {
    const dateRange = getDateRange(timeFilter);

    if (timeFilter === 'custom') {
        if (!customStartDate || !customEndDate) {
          // Don't fetch data or show error if dates aren't set
          setLoading(false);
          return;
        }
        if (isAfter(parseISO(customStartDate), parseISO(customEndDate))) {
          setError('Start date must be before end date');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }

    const processChartData = (filteredLogs) => {
      const groupedByDate = {};

      const fillMissingDates = (interval, formatStr) => {
        interval.forEach((date, index) => {
          const key = formatStr === 'Week' 
            ? `Week ${index + 1}`
            : format(date, formatStr);
          groupedByDate[key] = 0;
        });
      };

      if (timeFilter === 'lastWeek') {
        fillMissingDates(eachDayOfInterval({ start: dateRange[0], end: dateRange[1] }), 'yyyy-MM-dd');
      } else if (timeFilter === 'lastMonth') {
        fillMissingDates(eachWeekOfInterval({ start: dateRange[0], end: dateRange[1] }), 'Week');
      } else if (timeFilter === 'last6Months') {
        fillMissingDates(eachMonthOfInterval({ start: dateRange[0], end: dateRange[1] }), 'MMM yyyy');
      }

      let total = 0;
      filteredLogs.forEach(log => {
        const logDate = new Date(log.createdAt);
        let key;
        if (timeFilter === 'lastWeek') {
          key = format(logDate, 'yyyy-MM-dd');
        } else if (timeFilter === 'lastMonth') {
          const weekStart = format(subDays(logDate, logDate.getDay()), 'yyyy-MM-dd');
          key = Object.keys(groupedByDate).find(k => k.includes(weekStart));
        } else if (timeFilter === 'last6Months') {
          key = format(logDate, 'MMM yyyy');
        }
        groupedByDate[key] += log.caloriesBurned;
        total += log.caloriesBurned;
      });

      setTotalCaloriesBurned(total);

      const labels = Object.keys(groupedByDate);
      const caloriesBurned = labels.map(label => groupedByDate[label]);

      const data = {
        labels,
        datasets: [
          {
            label: 'Calories Burned',
            data: caloriesBurned,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.dark,
            borderWidth: 1,
          },
        ],
      };

      setChartData({ data, options: getChartOptions('Calories Burned') });
    };

    setLoading(true);
    fetchWorkoutData(dateRange)
      .then(filteredLogs => {
        processChartData(filteredLogs);
        setLoading(false);
      });
  }, [timeFilter, customStartDate, customEndDate, theme, getChartOptions, getDateRange]);


  const handleCustomStartDateChange = (event) => {
    setCustomStartDate(event.target.value);
  };

  const handleCustomEndDateChange = (event) => {
    setCustomEndDate(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const timeFilters = ['lastWeek', 'lastMonth', 'last6Months', 'custom'];

  return (
    <>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="textSecondary" fontSize={isMobile ? '1rem' : '1.25rem'}>
            Select Time Filter
          </Typography>
          <Grid container spacing={1}>
            {timeFilters.map((filter) => (
              <Grid item key={filter}>
                <StyledButton
                  active={timeFilter === filter ? timeFilters : null }
                  onClick={() => setTimeFilter(filter)}
                  aria-label={`Set time filter to ${filter}`}
                >
                  {filter}
                </StyledButton>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {timeFilter === 'custom' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="Start Date"
                  onChange={handleCustomStartDateChange}
                  value={customStartDate}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  aria-label="Select start date for custom range"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="End Date"
                  onChange={handleCustomEndDateChange}
                  value={customEndDate}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  aria-label="Select end date for custom range"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Box mt={4} height={isMobile ? 300 : 400}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
          </Box>
        ) : (
          chartData && (
            <>
              <Box height="100%">
                <Bar data={chartData.data} options={chartData.options} aria-label="Calories burned chart" />
              </Box>
              <Typography variant="h6" align="center" color="textSecondary" fontSize={isMobile ? '1rem' : '1.25rem'} mt={2}>
                Total Calories Burned: {totalCaloriesBurned.toLocaleString()} kcal
              </Typography>
            </>
          )
        )}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WorkoutChart;