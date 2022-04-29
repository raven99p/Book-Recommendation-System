import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
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
        Your Website
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
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    console.log(emailValue, password, firstName, lastName, username);
    let result;
    try {
      result = await axios.post('/api/createUser', {
        email: emailValue,
        username,
        password,
        firstName,
        lastName,
      });
      if (result.status === 406) setUsernameError(true);
      router.push('/user/userHome');
    } catch (err) {
      console.log(err);
      setUsernameError(true);
    }
  }

  function handlePasswordEntry(passwordValue) {
    setPassword(passwordValue);
    console.log(passwordValue.length);
    console.log(
      passwordValue.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/g,
      ),
    );
    if (
      !passwordValue.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/g,
      )
      && passwordValue.length !== 0
    ) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }
  function handleFirstNameEntry(value) {
    setFirstName(value);
  }
  function handleLastNameEntry(value) {
    setLastName(value);
  }
  function handleUsernameEntry(value) {
    setUsername(value);
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5" style={{ textAlign: 'center' }}>
          Sign Up
        </Typography>
        {usernameError && (
          <Typography
            component="h1"
            variant="subtitle1"
            style={{ textAlign: 'center', color: 'red' }}
          >
            Username already exists, try again..
          </Typography>
        )}
        <form method="post" onSubmit={handleRegister}>
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
            name="Username"
            label="Username"
            type="text"
            id="Username"
            onChange={(e) => handleUsernameEntry(e.target.value)}
          />
          <TextField
            // helperText={"}
            error={!!passwordError}
            helperText={
              passwordError
                ? 'Your password must be more than 8 characters and must contain at least one Capital letter, one number and a special character'
                : ''
            }
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => handlePasswordEntry(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="firstName"
            label="First Name"
            type="text"
            id="firstName"
            onChange={(e) => handleFirstNameEntry(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="lasName"
            label="Last Name"
            type="text"
            id="lastName"
            onChange={(e) => handleLastNameEntry(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleRegister}
          >
            Sign Up!
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
