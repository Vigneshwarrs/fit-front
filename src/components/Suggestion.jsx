import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Utensils, Dumbbell, Flame, Activity } from 'lucide-react'; // Add Flame and Activity icons
import api from '../../utils/api';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState({ food: [], workout: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api('/suggestions');
      console.log("Suggestions fetched", response);
      if (response.status !== 200) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.data;
      console.log("Suggestions fetched", data);
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const renderSuggestionList = (items, icon) => {
    if (items.length === 0) {
      return <Typography color="textSecondary" align="center">No suggestions available</Typography>;
    }
    
    return (
      <List>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box>{icon}</Box>
                </Grid>
                <Grid item xs>
                  <ListItemText 
                    primary={item.content} 
                    secondary={`Calories: ${item.calories}, Difficulty: ${item.difficulty}`} 
                  />
                </Grid>
                <Grid item>
                  <Flame size={20} /> {item.calories} kcal
                </Grid>
                <Grid item>
                  <Activity size={20} /> {item.difficulty}
                </Grid>
              </Grid>
            </ListItem>
            {index < items.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Your Daily Suggestions
        </Typography>
        
        <Typography variant="h6" mt={2}>
          Food Suggestions
        </Typography>
        {renderSuggestionList(suggestions.food, <Utensils size={24} />)}

        <Typography variant="h6" mt={4}>
          Workout Suggestions
        </Typography>
        {renderSuggestionList(suggestions.workout, <Dumbbell size={24} />)}

        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={fetchSuggestions}>
            Get New Suggestions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Suggestion;