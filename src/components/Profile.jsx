import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Grid,
  Avatar,
  Container,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit,
  User,
  Mail,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Target,
} from 'lucide-react';
import { updateUserProfile } from '../services/userService';

function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    setUser(userData);
    setFormValues(userData);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formValues.name?.trim()) errors.name = 'Name is required';
    if (!formValues.email?.trim()) errors.email = 'Email is required';
    if (!formValues.age) errors.age = 'Age is required';
    if (!formValues.height) errors.height = 'Height is required';
    if (!formValues.weight) errors.weight = 'Weight is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        await updateUserProfile(formValues);
        setUser(formValues);
        handleClose();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const matchGoal = (goal) => {
    switch(goal) {
      case 'weight-loss':
        return { text: 'Weight Loss', color: 'error' };
      case 'muscle-gain':
        return { text: 'Muscle Gain', color: 'success' };
      case 'general-fitness':
        return { text: 'General Fitness', color: 'info' };
      default:
        return { text: 'No Goal Set', color: 'default' };
    }
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Icon size={20} color={theme.palette.primary.main} />
      <Box ml={2}>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="body1">{value || 'Not set'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <Box
              sx={{
                height: 100,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              }}
            />
            <CardContent sx={{ textAlign: 'center', mt: -5 }}>
              <Avatar
                alt={user.name}
                src={user.profilePicture}
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  border: '4px solid white',
                  boxShadow: theme.shadows[3],
                }}
              />
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user.email}
              </Typography>
              <Chip
                label={matchGoal(user.goal?.goalName).text}
                color={matchGoal(user.goal?.goalName).color}
                size="small"
                sx={{ mt: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleOpen}
                fullWidth
                sx={{ mt: 3 }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Personal Info" />
              <Tab label="Fitness Stats" />
            </Tabs>
            <Box p={3}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem icon={User} label="Name" value={user.name} />
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={MapPin} label="Country" value={user.country} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem icon={Calendar} label="Age" value={`${user.age} years`} />
                    <InfoItem icon={User} label="Gender" value={user.gender} />
                    <InfoItem icon={Activity} label="Activity Level" value={user.activityLevel} />
                  </Grid>
                </Grid>
              )}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem icon={Ruler} label="Height" value={`${user.height} cm`} />
                    <InfoItem icon={Weight} label="Weight" value={`${user.weight} kg`} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem icon={Target} label="Goal" value={matchGoal(user.goal?.goalName).text} />
                    <InfoItem icon={Activity} label="BMI" value={(user.weight / ((user.height/100) ** 2)).toFixed(1)} />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Edit Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formValues.name || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formValues.email || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formValues.age || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.age}
                  helperText={formErrors.age}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formValues.gender || ''}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formValues.country || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formValues.height || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.height}
                  helperText={formErrors.height}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formValues.weight || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.weight}
                  helperText={formErrors.weight}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    name="activityLevel"
                    value={formValues.activityLevel || ''}
                    onChange={handleInputChange}
                    label="Activity Level"
                  >
                    <MenuItem value="sedentary">Sedentary</MenuItem>
                    <MenuItem value="lightlyActive">Lightly Active</MenuItem>
                    <MenuItem value="moderatelyActive">Moderately Active</MenuItem>
                    <MenuItem value="veryActive">Very Active</MenuItem>
                    <MenuItem value="extraActive">Extra Active</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}

export default ProfilePage;