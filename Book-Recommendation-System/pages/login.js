import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { useRouter } from 'next/router';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        HarOnline
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

export default function SignIn() {
  const router = useRouter();
  const [emailValue, setEmail] = useState();
  const [password, setPassword] = useState();
  const [wrongCreds, setWrongCreds] = useState(false);
  async function handleSignIn(e) {
    console.log(e);
    e.preventDefault();
    console.log(emailValue, password);
    let success;
    try {
      success = await axios.post('/api/login', { email: emailValue, password });
      if(success){
        window.location = '/user/userHome';
        // router.push('/user/userHome');
      }
    } catch (err) {
      console.log(err);
      setWrongCreds(true);
    }
    console.log(success);
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {wrongCreds && (
          <Box style={{ display: 'flex', paddingLeft: '20%' }}>
            <Typography variant="subtitle1" style={{ color: 'red' }}>
              Username or password Incorrect..
            </Typography>
          </Box>
        )}
        <form method="post" onSubmit={handleSignIn}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
