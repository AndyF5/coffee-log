import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import { User, getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import CoffeeForm from '../CoffeeForm/CoffeeForm';
import CoffeeFormDialog from '../CoffeeForm/CoffeeFormDialog';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [openCoffeeLogger, setOpenCoffeeLogger] = useState(false);

  const onSignOut = () => {
    const auth = getAuth();

    auth.signOut();
  };

  const onSpeedDialCoffee = () => {
    setOpenCoffeeLogger(true);
  };

  const onCoffeeLoggerSave = () => {
    console.log('onCoffeeLoggerSave');
  };

  return (
    <Box>
      <Typography variant="h1">
        Welcome to Coffee Log {user.displayName}!
      </Typography>
      <Typography mb={1}>Account: {user.email}</Typography>
      <Button onClick={onSignOut} variant="contained">
        Sign Out
      </Button>
      <SpeedDial
        ariaLabel={'Coffee Log Speed Dial'}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<CoffeeIcon />}
          onClick={onSpeedDialCoffee}
          tooltipTitle={'Log a Coffee'}
        />
      </SpeedDial>
      <CoffeeFormDialog open={openCoffeeLogger} setOpen={setOpenCoffeeLogger} />
    </Box>
  );
};

export default Dashboard;
