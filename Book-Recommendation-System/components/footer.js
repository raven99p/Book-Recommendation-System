import React from 'react';
import {
  Box, Typography, Container,
} from '@material-ui/core';

export default function AppFooter() {
  return (
    <footer>
      <Box
        style={{
          backgroundColor: '#20613e',
          bottom: 0,
          position: 'static',
          width: '100%',
          marginTop: 'calc(45vh - 50px)',
          padding: '2%',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography style={{ color: 'white' }}>Calorie Guess My Book</Typography>
          <Typography style={{ color: 'white' }}>Designed & Developed by CEID Baybee</Typography>
        </Container>
      </Box>
    </footer>
  );
}
