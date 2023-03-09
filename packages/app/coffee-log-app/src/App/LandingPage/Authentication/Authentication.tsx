import { Button, Grid } from '@mui/material';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';

const Authentication = () => {
  const onSignInWithGoogle = () => {
    const auth = getAuth();

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider);
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
