import { Box, Container, Link, Typography } from '@mui/material';
import Authentication from './Authentication';

const LandingPage = () => {
  return (
    <Container>
      <Typography variant="h1">Coffee Log</Typography>

      <Typography variant="subtitle1">
        An application for tracking your coffee experience.
      </Typography>

      <Box my={1}>
        <Authentication />
      </Box>

      <Box
        sx={{
          typography: 'body1',
        }}
      >
        <Link href="https://github.com/AndyF5/coffee-log">GitHub</Link>
      </Box>
    </Container>
  );
};

export default LandingPage;
