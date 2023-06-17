import {
  Button,
  List,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { User, getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import CoffeeFormDialog from '../CoffeeForm/CoffeeFormDialog';
import { useBrews } from '../../common/hooks';
import BrewListItem from './BrewListItem';
import BrewDetailsDialog from './BrewDetailsDialog';
import { BrewWithID } from '../../common/models';
import { Container } from '@mui/system';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [openCoffeeLogger, setOpenCoffeeLogger] = useState(false);
  const [openBrewDetails, setOpenBrewDetails] = useState<
    BrewWithID | undefined
  >(undefined);

  const { brews } = useBrews();

  const onSignOut = () => {
    const auth = getAuth();

    auth.signOut();
  };

  const onSpeedDialCoffee = () => {
    setOpenCoffeeLogger(true);
  };

  const onBrewClick = (brew: BrewWithID) => {
    setOpenBrewDetails(brew);
  };

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Typography variant="h2" component="h1">
        Coffee Log
      </Typography>
      <Typography mb={1}>Account: {user.email}</Typography>
      <Button onClick={onSignOut} variant="contained">
        Sign Out
      </Button>
      <Paper sx={{ padding: 1, marginTop: 1 }}>
        <Typography variant="h4">Recent Brews</Typography>
        <List dense={true}>
          {brews.map((brew) => (
            <BrewListItem
              brew={brew}
              onClick={() => onBrewClick(brew)}
              key={brew.id}
            />
          ))}
        </List>
      </Paper>
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
      <CoffeeFormDialog
        open={openCoffeeLogger}
        onClose={() => setOpenCoffeeLogger(false)}
      />
      <BrewDetailsDialog
        open={!!openBrewDetails}
        onClose={() => setOpenBrewDetails(undefined)}
        brew={openBrewDetails}
      />
    </Container>
  );
};

export default Dashboard;
