import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/router";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function updatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [mismatchError, setmismatchError] = useState(false);
  const [checkCredsError, setcheckCredsError] = useState(false);
  const [successfulUpdate, setsuccessfulUpdate] = useState(false);
  async function handleUpdatePassword(e) {
    console.log(e);
    e.preventDefault();
    if (passwordError || mismatchError || !password) {
      setcheckCredsError(true);
    } else {
      try {
        const resp = await axios.post("/api/updatePassword", { password });
        console.log(resp);
        if (resp.status === 200) {
          setsuccessfulUpdate(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    console.log(password);
  }

  function handlePasswordEntry(passwordValue) {
    setPassword(passwordValue);
    console.log(passwordValue.length);
    console.log(
      passwordValue.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/g
      )
    );
    if (
      !passwordValue.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/g
      ) &&
      passwordValue.length !== 0
    ) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }
  function handlePasswordVerify(value) {
    if (value !== password) {
      setmismatchError(true);
    } else {
      setmismatchError(false);
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        {!successfulUpdate ? (
          <div>
            <Typography
              component="h1"
              variant="h5"
              style={{ textAlign: "center" }}
            >
              Change Password
            </Typography>
            {checkCredsError && (
              <Typography
                component="h2"
                variant="subtitle1"
                style={{ textAlign: "center", color: "red" }}
              >
                Something is wrong, check your credentials..
              </Typography>
            )}
            <form method="post" onSubmit={handleUpdatePassword}>
              <TextField
                // helperText={"}
                error={!!passwordError}
                helperText={
                  passwordError
                    ? "Your password must be more than 8 characters and must contain at least one Capital letter, one number and a special character"
                    : ""
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
                // helperText={"}
                error={!!mismatchError}
                helperText={
                  mismatchError ? "The passwords provided must match" : ""
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Rewrite Password"
                type="password"
                id="verify"
                autoComplete="current-password"
                onChange={(e) => handlePasswordVerify(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpdatePassword}
              >
                Update Password
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <Typography
              component="h1"
              variant="h4"
              style={{ textAlign: "center" }}
            >
              Password has been updated!
            </Typography>
            <Button
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
              onClick={() => router.push("/user/userHome")}
            >
              Back Home
            </Button>
          </div>
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
