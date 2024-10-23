// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Tab,
//   Tabs,
//   useTheme,
//   useMediaQuery,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Stack,
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
// } from '@mui/material';
// import {
//   OpacityOutlined,
//   LocalDrinkOutlined,
//   ShowChartOutlined,
//   CheckCircleOutlined,
//   Add as AddIcon,
//   Remove as RemoveIcon,
//   Settings as SettingsIcon,
// } from '@mui/icons-material';
// import { Line } from 'react-chartjs-2';
// import { format, parseISO, isValid } from 'date-fns';
// import { fetchWaterData, updateWaterIntake, setDailyGoal } from '../../../redux/slice/waterSlice';

// const validationSchema = Yup.object().shape({
//   dailyGoal: Yup.number()
//     .min(1, 'Goal must be at least 1 glass')
//     .max(20, 'Goal cannot exceed 20 glasses')
//     .required('Daily goal is required'),
// });

// const WaterChart = () => {
//   const dispatch = useDispatch();
//   const { data: waterData, loading, error, dailyGoal } = useSelector(state => state.water);
//   const [tabValue, setTabValue] = useState(0);
//   const [todayGlasses, setTodayGlasses] = useState(0);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const safeDateFormat = (dateString, formatPattern, fallback = 'N/A') => {
//     try {
//       const date = parseISO(dateString);
//       return isValid(date) ? format(date, formatPattern) : fallback;
//     } catch {
//       return fallback;
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchWaterData());
//   }, [dispatch]);

//   const handleAddGlass = async () => {
//     try {
//       const newCount = todayGlasses + 1;
//       await dispatch(updateWaterIntake({
//         date: new Date().toISOString(),
//         glassCount: newCount,
//         goal: dailyGoal
//       })).unwrap();
//       setTodayGlasses(newCount);
//       setSnackbar({
//         open: true,
//         message: 'Water intake updated successfully!',
//         severity: 'success'
//       });
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: 'Failed to update water intake',
//         severity: 'error'
//       });
//     }
//   };

//   const handleRemoveGlass = async () => {
//     if (todayGlasses > 0) {
//       try {
//         const newCount = todayGlasses - 1;
//         await dispatch(updateWaterIntake({
//           date: new Date().toISOString(),
//           glassCount: newCount,
//           goal: dailyGoal
//         })).unwrap();
//         setTodayGlasses(newCount);
//         setSnackbar({
//           open: true,
//           message: 'Water intake updated successfully!',
//           severity: 'success'
//         });
//       } catch (err) {
//         setSnackbar({
//           open: true,
//           message: 'Failed to update water intake',
//           severity: 'error'
//         });
//       }
//     }
//   };

//   const SettingsDialog = () => (
//     <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
//       <DialogTitle>Water Tracking Settings</DialogTitle>
//       <Formik
//         initialValues={{ dailyGoal }}
//         validationSchema={validationSchema}
//         onSubmit={async (values, { setSubmitting }) => {
//           try {
//             await dispatch(setDailyGoal(values.dailyGoal));
//             setSnackbar({
//               open: true,
//               message: 'Daily goal updated successfully!',
//               severity: 'success'
//             });
//             setSettingsOpen(false);
//           } catch (err) {
//             setSnackbar({
//               open: true,
//               message: 'Failed to update daily goal',
//               severity: 'error'
//             });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
//           <Form onSubmit={handleSubmit}>
//             <DialogContent>
//               <TextField
//                 fullWidth
//                 name="dailyGoal"
//                 label="Daily Water Goal (glasses)"
//                 type="number"
//                 value={values.dailyGoal}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.dailyGoal && Boolean(errors.dailyGoal)}
//                 helperText={touched.dailyGoal && errors.dailyGoal}
//                 margin="normal"
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
//               <Button type="submit" disabled={isSubmitting} variant="contained">
//                 Save
//               </Button>
//             </DialogActions>
//           </Form>
//         )}
//       </Formik>
//     </Dialog>
//   );

//   const getChartData = () => {
//     if (!waterData?.length) return null;

//     return {
//       labels: waterData.map(entry => safeDateFormat(entry.date, 'MMM dd')),
//       datasets: [
//         {
//           label: 'Glasses of Water',
//           data: waterData.map(entry => entry.glassCount),
//           borderColor: theme.palette.primary.main,
//           backgroundColor: `${theme.palette.primary.main}20`,
//           tension: 0.4,
//           fill: true,
//         },
//         {
//           label: 'Daily Goal',
//           data: waterData.map(entry => entry.goal),
//           borderColor: theme.palette.secondary.main,
//           borderDash: [5, 5],
//           tension: 0,
//           pointRadius: 0,
//         }
//       ]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Water Consumption Trend'
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Glasses of Water'
//         }
//       }
//     }
//   };

//   const StatCard = ({ icon, title, value, color, children }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           {icon}
//           <Typography variant="h6" sx={{ ml: 1 }}>
//             {title}
//           </Typography>
//         </Box>
//         <Typography variant="h4" color={color}>
//           {value}
//         </Typography>
//         {children}
//       </CardContent>
//     </Card>
//   );

//   const getWaterStats = () => {
//     if (!waterData?.length) return null;

//     const avgConsumption = waterData.reduce((acc, curr) => acc + curr.glassCount, 0) / waterData.length;
//     const goalAchievement = waterData.filter(day => day.glassCount >= day.goal).length;
//     const achievementRate = (goalAchievement / waterData.length) * 100;

//     return {
//       average: avgConsumption.toFixed(1),
//       achievementRate: achievementRate.toFixed(0),
//       totalWeek: waterData.reduce((acc, curr) => acc + curr.glassCount, 0),
//       goalProgress: ((todayGlasses / dailyGoal) * 100).toFixed(0)
//     };
//   };

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       );
//     }

//     if (error) {
//       return <Alert severity="error">{error}</Alert>;
//     }

//     if (!waterData?.length) {
//       return <Alert severity="info">No water tracking data available.</Alert>;
//     }

//     const stats = getWaterStats();

//     return (
//       <Box>
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6} md={6}>
//             <StatCard
//               icon={<LocalDrinkOutlined color="primary" />}
//               title="Today's Progress"
//               value={`${todayGlasses}/${dailyGoal}`}
//               color="primary"
//             >
//               <Stack direction="row" spacing={1} mt={2} justifyContent="center">
//                 <IconButton onClick={handleRemoveGlass} disabled={todayGlasses === 0}>
//                   <RemoveIcon />
//                 </IconButton>
//                 <IconButton onClick={handleAddGlass}>
//                   <AddIcon />
//                 </IconButton>
//               </Stack>
//             </StatCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={6}>
//             <StatCard
//               icon={<OpacityOutlined color="info" />}
//               title="Daily Average"
//               value={`${stats.average}`}
//               color="info"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={6}>
//             <StatCard
//               icon={<ShowChartOutlined color="success" />}
//               title="Weekly Total"
//               value={stats.totalWeek}
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={6}>
//             <StatCard
//               icon={<CheckCircleOutlined color="secondary" />}
//               title="Goal Achievement"
//               value={`${stats.achievementRate}%`}
//               color="secondary"
//             />
//           </Grid>
//         </Grid>

//         <Paper sx={{ mb: 4 }}>
//           <Tabs
//             value={tabValue}
//             onChange={(e, newValue) => setTabValue(newValue)}
//             centered={!isMobile}
//             variant={isMobile ? "scrollable" : "standard"}
//             scrollButtons="auto"
//           >
//             <Tab label="Chart View" />
//             <Tab label="Table View" />
//           </Tabs>

//           <Box sx={{ p: 3 }}>
//             {tabValue === 0 ? (
//               <Box sx={{ height: 400 }}>
//                 <Line data={getChartData()} options={chartOptions} />
//               </Box>
//             ) : (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Date</TableCell>
//                       <TableCell align="center">Glasses Consumed</TableCell>
//                       <TableCell align="center">Daily Goal</TableCell>
//                       <TableCell align="center">Achievement</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {waterData.map((entry, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{safeDateFormat(entry.date, 'MMM dd, yyyy')}</TableCell>
//                         <TableCell align="center">{entry.glassCount}</TableCell>
//                         <TableCell align="center">{entry.goal}</TableCell>
//                         <TableCell align="center">
//                           <Box sx={{ 
//                             display: 'flex', 
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             color: entry.glassCount >= entry.goal ? 'success.main' : 'text.secondary'
//                           }}>
//                             {entry.glassCount >= entry.goal ? (
//                               <CheckCircleOutlined sx={{ mr: 1 }} />
//                             ) : null}
//                             {((entry.glassCount / entry.goal) * 100).toFixed(0)}%
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>
//         </Paper>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 } }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4">Water Consumption Analytics</Typography>
//         <IconButton onClick={() => setSettingsOpen(true)} color="primary">
//           <SettingsIcon />
//         </IconButton>
//       </Box>
      
//       {renderContent()}
//       <SettingsDialog />
      
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default WaterChart;
import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  Tab,
  Box,
  Grid,
  Typography
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';

// Register the necessary components for chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WaterChart() {
  const { chartData, stats } = useSelector((state) => state.water);
  const [tabValue, setTabValue] = React.useState('chart');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format data for Chart.js
  const formatChartData = (data) => {
    return {
      labels: data.map((entry) => format(new Date(entry.date), 'MMM dd')),
      datasets: [
        {
          label: 'Consumed (glasses)',
          data: data.map((entry) => entry.glassCount),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          fill: true,
        },
        {
          label: 'Goal (glasses)',
          data: data.map((entry) => entry.goal),
          borderColor: '#ef4444',
          borderDash: [5, 5],
          fill: false,
        }
      ]
    };
  };

  const getProgressColor = (value) => {
    if (value >= 100) return '#22c55e'; // green
    if (value >= 75) return '#f59e0b';  // yellow
    return '#ef4444'; // red
  };

  return (
    <Card sx={{ width: '100%', mt: 6 }}>
      <CardHeader title="Water Consumption Analysis" />
      <CardContent>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Water consumption tabs">
              <Tab label="Chart" value="chart" />
              <Tab label="Statistics" value="stats" />
            </TabList>
          </Box>

          <TabPanel value="chart">
            <Box sx={{ height: 400 }}>
              <Line data={formatChartData(chartData)} />
            </Box>
          </TabPanel>

          <TabPanel value="stats">
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">Weekly Average</Typography>
                  <Typography variant="h6">
                    {stats.weeklyAverage.toFixed(1)} glasses
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">Monthly Average</Typography>
                  <Typography variant="h6">
                    {stats.monthlyAverage.toFixed(1)} glasses
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">Best Streak</Typography>
                  <Typography variant="h6">
                    {stats.bestStreak} days
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">Total Water</Typography>
                  <Typography variant="h6">
                    {(stats.totalWaterConsumed / 1000).toFixed(1)}L
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">Achievement Rate</Typography>
                  <Typography variant="h6" sx={{ color: getProgressColor(stats.achievementRate) }}>
                    {stats.achievementRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </CardContent>
    </Card>
  );
}
