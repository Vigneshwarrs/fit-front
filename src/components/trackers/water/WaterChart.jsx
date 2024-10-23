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
  IconButton,
  Stack,
} from '@mui/material';
import {
  OpacityOutlined,
  LocalDrinkOutlined,
  ShowChartOutlined,
  CheckCircleOutlined,
  Add as AddIcon,
  Remove as RemoveIcon,
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

// Register ChartJS components
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

const WaterChart = () => {
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [todayGlasses, setTodayGlasses] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8); // Default goal: 8 glasses
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

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        setLoading(true);
        // Simulated data - replace with actual API call
        const mockData = Array.from({ length: 7 }, (_, index) => ({
          date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toISOString(),
          glassCount: Math.floor(Math.random() * 10) + 4,
          goal: 8,
        }));
        setWaterData(mockData);
        // Set today's data
        setTodayGlasses(mockData[mockData.length - 1].glassCount);
        setDailyGoal(mockData[mockData.length - 1].goal);
      } catch (err) {
        setError('Failed to fetch water consumption data. Please try again later.');
        console.error('Water data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWaterData();
  }, []);

  const handleAddGlass = () => {
    setTodayGlasses(prev => prev + 1);
  };

  const handleRemoveGlass = () => {
    setTodayGlasses(prev => Math.max(0, prev - 1));
  };

  const getChartData = () => {
    if (!waterData?.length) return null;

    return {
      labels: waterData.map(entry => safeDateFormat(entry.date, 'MMM dd')),
      datasets: [
        {
          label: 'Glasses of Water',
          data: waterData.map(entry => entry.glassCount),
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}20`,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Daily Goal',
          data: waterData.map(entry => entry.goal),
          borderColor: theme.palette.secondary.main,
          borderDash: [5, 5],
          tension: 0,
          pointRadius: 0,
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
        text: 'Water Consumption Trend'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Glasses of Water'
        }
      }
    }
  };

  const StatCard = ({ icon, title, value, color, children }) => (
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
        {children}
      </CardContent>
    </Card>
  );

  const getWaterStats = () => {
    if (!waterData?.length) return null;

    const avgConsumption = waterData.reduce((acc, curr) => acc + curr.glassCount, 0) / waterData.length;
    const goalAchievement = waterData.filter(day => day.glassCount >= day.goal).length;
    const achievementRate = (goalAchievement / waterData.length) * 100;

    return {
      average: avgConsumption.toFixed(1),
      achievementRate: achievementRate.toFixed(0),
      totalWeek: waterData.reduce((acc, curr) => acc + curr.glassCount, 0),
      goalProgress: ((todayGlasses / dailyGoal) * 100).toFixed(0)
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

    if (!waterData?.length) {
      return <Alert severity="info">No water tracking data available.</Alert>;
    }

    const stats = getWaterStats();

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<LocalDrinkOutlined color="primary" />}
              title="Today's Progress"
              value={`${todayGlasses}/${dailyGoal}`}
              color="primary"
            >
              <Stack direction="row" spacing={1} mt={2} justifyContent="center">
                <IconButton onClick={handleRemoveGlass} disabled={todayGlasses === 0}>
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={handleAddGlass}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<OpacityOutlined color="info" />}
              title="Daily Average"
              value={`${stats.average}`}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<ShowChartOutlined color="success" />}
              title="Weekly Total"
              value={stats.totalWeek}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              icon={<CheckCircleOutlined color="secondary" />}
              title="Goal Achievement"
              value={`${stats.achievementRate}%`}
              color="secondary"
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
                      <TableCell align="center">Glasses Consumed</TableCell>
                      <TableCell align="center">Daily Goal</TableCell>
                      <TableCell align="center">Achievement</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {waterData.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{safeDateFormat(entry.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell align="center">{entry.glassCount}</TableCell>
                        <TableCell align="center">{entry.goal}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: entry.glassCount >= entry.goal ? 'success.main' : 'text.secondary'
                          }}>
                            {entry.glassCount >= entry.goal ? (
                              <CheckCircleOutlined sx={{ mr: 1 }} />
                            ) : null}
                            {((entry.glassCount / entry.goal) * 100).toFixed(0)}%
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
        Water Consumption Analytics
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default WaterChart;