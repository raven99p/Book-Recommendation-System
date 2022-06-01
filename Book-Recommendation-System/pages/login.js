import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useRouter } from "next/router";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Reader's Cove
      </Link>{" "}
      {new Date().getFullYear()}.
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
      success = await axios.post(
        "http://localhost:3000/api/login",
        { email: emailValue, password },
        { withCredentials: true }
      );
      if (success) {
        console.log(success.status);
        window.location = `/`;
        // router.push('/user/userHome');
      }
    } catch (err) {
      console.log(err);
      setWrongCreds(true);
    }
    console.log(success);
  }
  return (
    <div
      style={{
        display: "flex",
        backgroundImage: `url(/login.jpg)`,
        marginTop: "-10em",
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ height: "100vh" }}>
        <CssBaseline />
        <div style={{ textAlign: "center", marginTop: "10em" }}>
          <Typography component="h1" variant="h4" color="white">
            Welcome
          </Typography>
          {wrongCreds && (
            <Box style={{ display: "flex", paddingLeft: "20%" }}>
              <Typography variant="subtitle1" style={{ color: "red" }}>
                Username or password Incorrect..
              </Typography>
            </Box>
          )}
          <form method="post" onSubmit={handleSignIn}>
            <TextField
              variant="outlined"
              sx={{ background: "white", borderRadius: "10px" }}
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
              sx={{ background: "white", borderRadius: "10px" }}
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              sx={{
                paddingTop: "1em",
                borderRadius: "20px",
                marginTop: "1em",
                marginBottom: "1em",
              }}
            >
              Sign In
            </Button>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Link href="/register" variant="body2" sx={{ color: "white" }}>
                  Don&apos;t have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
