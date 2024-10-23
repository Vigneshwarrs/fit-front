import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Modal, TextField, Grid, Avatar } from '@mui/material';
import { Edit } from 'lucide-react';
import { updateUserProfile } from '../services/userService';

function ProfilePage() {
  // Initial user data
  const [user, setUser] = useState({});

  // Form management
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    // Fetch user data from API or local storage here
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    setUser(userData);
    setFormValues(userData);
  },[]);

  // Open and close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    if (!formValues.name) errors.name = 'Name is required';
    if (!formValues.email) errors.email = 'Email is required';
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setUser(formValues);
      await updateUserProfile(formValues).then((data)=>console.log(data));
      handleClose();
    } else {
      setFormErrors(errors);
    }
  };

  const matchGoal = (goal) => {
    switch(goal){
      case 'weight-loss':
        return 'You are currently trying to lose weight.';
      case 'muscle-gain':
        return 'You are currently trying to gain muscle.';
      case 'general-fitness':
        return 'You are currently maintaining your current weight.';
      default:
        return 'No specific goal set.';
    }
  };

  return (
    <Box p={4}>
      {/* Profile Display Card */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={4}>
            <Avatar 
              alt={user.name} 
              sx={{ width: 100, height: 100 }} 
            />
          </Box>
          <Typography variant="h5" align="center" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" align="center">
            {user.email}
          </Typography>
          <Box mt={3}>
            <Typography variant="body2"><strong>Age:</strong> {user.age}</Typography>
            <Typography variant="body2"><strong>Country:</strong> {user.country}</Typography>
            <Typography variant="body2"><strong>Gender:</strong> {user.gender}</Typography>
            <Typography variant="body2"><strong>Height:</strong> {user.height} cm</Typography>
            <Typography variant="body2"><strong>Weight:</strong> {user.weight} kg</Typography>
            <Typography variant="body2"><strong>Activity Level:</strong> {user.activityLevel}</Typography>
            <Typography variant="body2"><strong>Goal:</strong> {matchGoal(user.goal?.goalName)}</Typography>
          </Box>
          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" startIcon={<Edit />} onClick={handleOpen}>
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>Edit Profile</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  value={formValues.age}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formValues.country}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formValues.gender}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  value={formValues.height}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  value={formValues.weight}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Activity Level"
                  name="activityLevel"
                  value={formValues.activityLevel}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default ProfilePage;
