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
      <Dialog
        open={openCoffeeLogger}
        onClose={() => setOpenCoffeeLogger(false)}
      >
        <DialogTitle>Coffee Logger</DialogTitle>
        <DialogContent sx={{ padding: 1 }}>
          <DialogContentText>
            Enter your coffee information here!
          </DialogContentText>
          <CoffeeForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoffeeLogger(false)}>Cancel</Button>
          <Button onClick={onCoffeeLoggerSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
