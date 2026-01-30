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
import { User, getAuth } from 'firebase/auth';
import { useState } from 'react';
import CoffeeFormDialog from '../CoffeeForm/CoffeeFormDialog';
import { useBrews } from '../../hooks';
import BrewListItem from '../BrewDetails/BrewListItem';
import BrewDetailsDialog from '../BrewDetails/BrewDetailsDialog';
import { BrewForm, BrewWithID } from '../../models';
import { Container } from '@mui/system';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [openCoffeeLogger, setOpenCoffeeLogger] = useState(false);
  const [openBrewDetails, setOpenBrewDetails] = useState<
    BrewWithID | undefined
  >(undefined);
  const [initialFormState, setInitialFormState] = useState<
    BrewForm | undefined
  >(undefined);

  const { brews } = useBrews();

  const onSignOut = () => {
    const auth = getAuth();

    auth.signOut();
  };

  const onSpeedDialCoffee = () => {
    setInitialFormState(undefined);
    setOpenCoffeeLogger(true);
  };

  const onBrewClick = (brew: BrewWithID) => {
    setOpenBrewDetails(brew);
  };

  const onBrewRepeat = () => {
    if (openBrewDetails) {
      const { id: _id, notes: _notes, tags: _tags, rating: _rating, ...newBrewForm } = openBrewDetails;

      setInitialFormState({
        ...newBrewForm,
        coffeeAmount: newBrewForm.coffeeAmount.toString(),
        grindSetting: newBrewForm.grindSetting.toString(),
        waterAmount: newBrewForm.waterAmount.toString(),
        temperature: newBrewForm.temperature.toString(),
        brewTime: newBrewForm.brewTime.toString(),
        notes: '',
        tags: [],
        rating: 3.0,
      });

      setOpenBrewDetails(undefined);

      setOpenCoffeeLogger(true);
    }
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
        initialFormState={initialFormState}
      />
      <BrewDetailsDialog
        open={!!openBrewDetails}
        onClose={() => setOpenBrewDetails(undefined)}
        brew={openBrewDetails}
        onBrewRepeat={onBrewRepeat}
      />
    </Container>
  );
};

export default Dashboard;
