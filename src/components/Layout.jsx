import React from 'react';
import Navbar from './navbar/Navbar';
import Container from '@mui/material/Container';

function Layout({children}) {
  return (
    <>
      <Navbar />
      <Container style={{marginTop: '20px'}} maxWidth="lg">
        {children}
      </Container>
    </>
  )
}

export default Layout