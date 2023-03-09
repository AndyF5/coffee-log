import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import LandingPage from './LandingPage/LandingPage';
import { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';

export function App() {
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => setUser(user));

  return !user ? <LandingPage /> : <Dashboard user={user} />;
}

export default App;
