import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BedtimeOutlined,
  WbSunnyOutlined,
  AccessTimeOutlined,
  MoodOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO, isValid } from 'date-fns';
import { getSleep } from '../../../services/trackerService';
import { useDispatch, useSelector } from 'react-redux';
import { sleepSet } from '../../../redux/slice/sleepSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const SleepChart = () => {
  const dispatch = useDispatch();
  const [sleepData, setSleepData] = useState(null);
  const {sleeps} = useSelector((state)=> state.sleep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Safe date formatting helper
  const safeDateFormat = (dateString, formatPattern, fallback = 'N/A') => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, formatPattern) : fallback;
    } catch {
      return fallback;
    }
  };

  // Safe data validation helper
  const validateSleepEntry = (entry) => {
    return {
      ...entry,
      duration: typeof entry.duration === 'number' && !isNaN(entry.duration) ? entry.duration : 0,
      quality: typeof entry.quality === 'number' && !isNaN(entry.quality) ? entry.quality : 0,
      date: entry.date && isValid(parseISO(entry.date)) ? entry.date : new Date().toISOString(),
      bedTime: entry.bedTime && isValid(parseISO(entry.bedTime)) ? entry.bedTime : null,
      wakeTime: entry.wakeTime && isValid(parseISO(entry.wakeTime)) ? entry.wakeTime : null,
      mood: entry.mood || 'Not recorded'
    };
  };

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        setLoading(true);
        await getSleep().then((res)=>{
          dispatch(sleepSet(res.data));
          const validatedData = sleeps
            .map(validateSleepEntry)
            .filter(entry => entry.duration > 0);
          setSleepData(validatedData);  
        }).catch((err) => {
        setError('Failed to fetch sleep data. Please try again later.');
        console.error('Sleep data fetch error:', err);
          setLoading(false);
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch sleep data. Please try again later.');
        console.error('Sleep data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSleepData();
  }, [dispatch, sleeps]);

  const getChartData = () => {
    if (!sleepData?.length) return null;

    return {
      labels: sleepData.map(entry => safeDateFormat(entry.date, 'MMM dd')),
      datasets: [
        {
          label: 'Sleep Duration (hours)',
          data: sleepData.map(entry => (entry.duration / 60).toFixed(1)),
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          tension: 0.4,
        },
        {
          label: 'Sleep Quality (1-10)',
          data: sleepData.map(entry => entry.quality),
          borderColor: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.light,
          tension: 0.4,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sleep Patterns Over Time'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}${context.datasetIndex === 0 ? ' hrs' : ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value, index, values) => {
            return value + (index === values.length - 1 ? ' hrs' : '');
          }
        }
      }
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const getAverageStats = () => {
    if (!sleepData?.length) return null;

    const avgDuration = sleepData.reduce((acc, curr) => acc + curr.duration, 0) / sleepData.length;
    const avgQuality = sleepData.reduce((acc, curr) => acc + curr.quality, 0) / sleepData.length;

    const mostCommonTime = (timeKey) => {
      const validTimes = sleepData
        .filter(entry => entry[timeKey] && isValid(parseISO(entry[timeKey])))
        .map(entry => safeDateFormat(entry[timeKey], 'HH:mm'));
      
      if (!validTimes.length) return 'N/A';
      
      const timeCount = validTimes.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommon = Object.entries(timeCount)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      return format(parseISO(`2000-01-01T${mostCommon}`), 'hh:mm a');
    };

    return {
      duration: (avgDuration / 60).toFixed(1),
      quality: avgQuality.toFixed(1),
      commonBedTime: mostCommonTime('bedTime'),
      commonWakeTime: mostCommonTime('wakeTime')
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (!sleepData?.length) {
      return <Alert severity="info">No sleep data available.</Alert>;
    }

    const avgStats = getAverageStats();

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<AccessTimeOutlined color="primary" />}
              title="Avg Sleep Duration"
              value={`${avgStats.duration}h`}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<TrendingUpOutlined color="secondary" />}
              title="Avg Sleep Quality"
              value={avgStats.quality}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<BedtimeOutlined color="info" />}
              title="Most Common Bedtime"
              value={avgStats.commonBedTime}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<WbSunnyOutlined color="warning" />}
              title="Most Common Wake Time"
              value={avgStats.commonWakeTime}
              color="warning"
            />
          </Grid>
        </Grid>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            centered={!isMobile}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab label="Chart View" />
            <Tab label="Table View" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 ? (
              <Box sx={{ height: 400 }}>
                <Line data={getChartData()} options={chartOptions} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Quality</TableCell>
                      <TableCell>Mood</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sleepData.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{safeDateFormat(entry.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{(entry.duration / 60).toFixed(1)}h</TableCell>
                        <TableCell>{entry.quality}/10</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MoodOutlined sx={{ mr: 1 }} />
                            {entry.mood}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Sleep Analytics
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default SleepChart;