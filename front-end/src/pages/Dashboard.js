import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Grid } from '@mui/material';

export const Dashboard = () => {
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    // Fetch job posts data from your API endpoint
    const fetchJobPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-job-posts');
        if (response.ok) {
          const data = await response.json();
          setJobPosts(data);
        } else {
          console.error('Failed to fetch job posts');
        }
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    fetchJobPosts();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {jobPosts.map(jobPost => (
          <Grid item xs={12} sm={6} md={4} key={jobPost._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{jobPost.role}</Typography>
                <Typography variant="body1">Company: {jobPost.company_name}</Typography>
                <Typography variant="body1">Location: {jobPost.location}</Typography>
                <Typography variant="body1">Salary: {jobPost.minCTC} - {jobPost.maxCTC}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

