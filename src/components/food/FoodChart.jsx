import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
  Grid,
  Select,
  MenuItem,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import api from '../../utils/api';
import 'chart.js/auto';

const NutritionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('lastWeek');
  const [nutritionMetric, setNutritionMetric] = useState('calories');
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const getDateRange = (filter) => {
    const today = new Date();
    switch (filter) {
      case 'lastWeek':
        return { startDate: format(subDays(today, 7), 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd') };
      case 'lastMonth':
        return { startDate: format(subWeeks(today, 4), 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd') };
      case 'last6Months':
        return { startDate: format(subMonths(today, 6), 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd') };
      default:
        return { startDate: format(subDays(today, 7), 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd') };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = getDateRange(timeFilter);
        const response = await api(
          `/nutrition?startDate=${startDate}&endDate=${endDate}&limit=100`
        );

        if (!response.ok) throw new Error('Failed to fetch nutrition data');
        
        const {data} = await response;
        
        // Process the data for the chart
        const processedData = data.data.map(entry => ({
          date: format(new Date(entry.date), 'MMM dd'),
          calories: entry.totalCalories,
          protein: entry.totalProtein,
          carbs: entry.totalCarbs,
          fat: entry.totalFat
        }));

        // Calculate totals
        const newTotals = data.data.reduce((acc, entry) => ({
          calories: acc.calories + entry.totalCalories,
          protein: acc.protein + entry.totalProtein,
          carbs: acc.carbs + entry.totalCarbs,
          fat: acc.fat + entry.totalFat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setChartData(processedData);
        setTotals(newTotals);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]);

  const metrics = [
    { key: 'calories', label: 'Calories', color: '#2563eb' },
    { key: 'protein', label: 'Protein', color: '#16a34a' },
    { key: 'carbs', label: 'Carbs', color: '#dc2626' },
    { key: 'fat', label: 'Fat', color: '#ca8a04' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Amount' } },
    },
  };

  const chartDataConfig = {
    labels: chartData.map((entry) => entry.date),
    datasets: metrics
      .filter((metric) => nutritionMetric === metric.key)
      .map((metric) => ({
        label: metric.label,
        data: chartData.map((entry) => entry[metric.key]),
        borderColor: metric.color,
        backgroundColor: `${metric.color}33`,
        fill: true,
        lineTension: 0.2,
      })),
  };

  return (
    <Card sx={{ p: 4 }}>
      <CardContent>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Time Range</Typography>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                fullWidth
              >
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="last6Months">Last 6 Months</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Metric</Typography>
              <Select
                value={nutritionMetric}
                onChange={(e) => setNutritionMetric(e.target.value)}
                fullWidth
              >
                {metrics.map((metric) => (
                  <MenuItem key={metric.key} value={metric.key}>
                    {metric.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Box>

        <Box height={400}>
          <Line data={chartDataConfig} options={chartOptions} />
        </Box>

        <Grid container spacing={2} mt={4}>
          {metrics.map(({ key, label, color }) => (
            <Grid item xs={6} md={3} key={key}>
              <Box p={2} border={`1px solid ${color}`} borderRadius={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  {label} Total
                </Typography>
                <Typography variant="h6">
                  {totals[key].toLocaleString()} {key === 'calories' ? 'kcal' : 'g'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;

