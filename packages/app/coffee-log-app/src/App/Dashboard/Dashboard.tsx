import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
    <Box>
      <Typography variant="h2" component="h1">
        Welcome to Coffee Log {user.displayName}!
      </Typography>
      <Typography mb={1}>Account: {user.email}</Typography>
      <Button onClick={onSignOut} variant="contained">
        Sign Out
      </Button>
      <List
        dense={true}
        subheader={<ListSubheader>Recent Brews</ListSubheader>}
      >
        {brews.map((brew) => (
          <BrewListItem
            brew={brew}
            onClick={() => onBrewClick(brew)}
            key={brew.id}
          />
        ))}
      </List>
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
    </Box>
  );
};

export default Dashboard;
