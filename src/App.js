import { ThemeProvider } from '@emotion/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/Layout'
import Routing from './routes/Routing'
import { createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50', // Fitness-related vibrant color
    },
    secondary: {
      main: '#0288d1', // Blue accent color
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout />
        <Routing />
      </Router>
    </ThemeProvider>
  )
}

export default App;