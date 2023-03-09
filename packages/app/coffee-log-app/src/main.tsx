import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import App from './App/App';

const firebaseConfig = {
  apiKey: 'AIzaSyBNIKoHyXp1gCDXPAdhzsQL1MJoTAAGxUA',
  authDomain: 'coffee-log-ea596.firebaseapp.com',
  projectId: 'coffee-log-ea596',
  storageBucket: 'coffee-log-ea596.appspot.com',
  messagingSenderId: '777746585162',
  appId: '1:777746585162:web:3bb34138a2b06d521cf8b3',
  measurementId: 'G-W5JVY21PYK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'development') {
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
