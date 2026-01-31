import { Button, Grid } from '@mui/material';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { useNotification } from '../../hooks';

const Authentication = () => {
  const { showNotification } = useNotification();

  const onSignInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error('Sign-in failed:', error);
      showNotification('Sign-in failed. Please try again.', 'error');
    }
  };

  return (
    <Grid container>
      <Grid item>
        <Button onClick={onSignInWithGoogle} variant="outlined">
          Continue with Google
        </Button>
      </Grid>
    </Grid>
  );
};

export default Authentication;
