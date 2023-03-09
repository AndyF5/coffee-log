import { Box, Button, Typography } from '@mui/material';
import { User, getAuth } from 'firebase/auth';
import React from 'react';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const onSignOut = () => {
    const auth = getAuth();

    auth.signOut();
  };

  return (
    <Box>
      <Typography mb={1}>{JSON.stringify(user)}</Typography>
      <Button onClick={onSignOut} variant="contained">
        Sign Out
      </Button>
    </Box>
  );
};

export default Dashboard;
