import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import LandingPage from './LandingPage/LandingPage';
import { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

export function App() {
  let theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  theme = responsiveFontSizes(theme);

  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => setUser(user));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!user ? <LandingPage /> : <Dashboard user={user} />}
    </ThemeProvider>
  );
}

export default App;
