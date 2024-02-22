import React from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';

export const CompReg = ()=> {
  return (
    
    <Container maxWidth="sm">
        
      <Typography variant="h4" align="center" gutterBottom>
        Signup dor Company
      </Typography>
      <form>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Signup
        </Button>
      </form>
    </Container>
  );
}

