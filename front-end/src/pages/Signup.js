import React from 'react';
import { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export const Signup = ()=> {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmitStudent = async (e) =>{
    e.preventDefault();

    try{
      const response = await fetch('http://localhost:3001/signup-stud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log(data);
    }catch(error){
      console.error('Error: ',error);
    }
    navigate('/');

  }

  return (
    
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Signup For Student
      </Typography>
      <form >
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e)=>setName(e.target.value)}
        />
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange = {(e)=> setEmail(e.target.value)}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e)=>setPassword(e.target.value) }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmitStudent}
          fullWidth
        >
          Signup as student
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Signup as company
        </Button>
      </form>
    </Container>
  );
}

