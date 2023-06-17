import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import LandingPage from './LandingPage/LandingPage';
import { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme();
theme = responsiveFontSizes(theme);

export function App() {
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => setUser(user));

  return (
    <ThemeProvider theme={theme}>
      {!user ? <LandingPage /> : <Dashboard user={user} />}
    </ThemeProvider>
  );
}

export default App;
