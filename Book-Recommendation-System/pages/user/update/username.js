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
        Reader's Cove
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function updatePassword() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [checkCredsError, setcheckCredsError] = useState(false);
  const [successfulUpdate, setsuccessfulUpdate] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  async function handleUpdateUsername(e) {
    e.preventDefault();
    if (!username) {
      setcheckCredsError(true);
    } else {
      try {
        const resp = await axios.post("/api/updateUsername", { username });
        console.log(resp);
        if (resp.status === 200) {
          setsuccessfulUpdate(true);
        } else if (resp.status === 406) {
          setUsernameExists(true);
        }
      } catch (err) {
        console.log(err);
        setUsernameExists(true);
      }
    }
  }

  function handleUsernameEntry(usernameValue) {
    setUsername(usernameValue);
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
              Change Username
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
            {usernameExists && (
              <Typography
                component="h2"
                variant="subtitle1"
                style={{ textAlign: "center", color: "red" }}
              >
                Username already exists
              </Typography>
            )}
            <form method="post" onSubmit={handleUpdateUsername}>
              <TextField
                // helperText={"}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newUsername"
                label="New Username"
                type="text"
                id="newusername"
                onChange={(e) => handleUsernameEntry(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpdateUsername}
              >
                Update Username
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <Typography
              noWrap
              component="h1"
              variant="h4"
              style={{ textAlign: "center" }}
            >
              Username has been updated!
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
