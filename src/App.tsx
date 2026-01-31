import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import LandingPage from './components/LandingPage/LandingPage';
import { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

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
      <ErrorBoundary>
        <NotificationProvider>
          {!user ? <LandingPage /> : <Dashboard user={user} />}
        </NotificationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
