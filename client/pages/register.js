import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useRouter } from "next/router";
import { Autocomplete } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
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
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState(1);
  async function handleRegister(e) {
    e.preventDefault();
    console.log(
      emailValue,
      password,
      firstName,
      lastName,
      username,
      age,
      country
    );
    let result;
    try {
      result = await axios.post("/api/createUser", {
        email: emailValue,
        username,
        password,
        firstName,
        lastName,
        age,
        country,
      });
      if (result.status === 406) setUsernameError(true);
      router.push("/user/userHome");
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
  function handleFirstNameEntry(value) {
    setFirstName(value);
  }
  function handleLastNameEntry(value) {
    setLastName(value);
  }
  function handleUsernameEntry(value) {
    setUsername(value);
  }
  function handleAgeEntry(value) {
    setAge(value);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
          Sign Up
        </Typography>
        {usernameError && (
          <Typography
            component="h1"
            variant="subtitle1"
            style={{ textAlign: "center", color: "red" }}
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Age"
            label="Age"
            type="number"
            id="age"
            onChange={(e) => handleAgeEntry(parseInt(e.target.value))}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ mb: "3em", mt: "1em" }}
                label="Country"
              />
            )}
            autoComplete
            options={countries}
            getOptionLabel={(option) => option.name}
            // renderOption={(props, option) => (
            //   <Typography variant="body1" sx={{ padding: "1em" }}>
            //     {option.name}
            //   </Typography>
            // )}
            onChange={(_, newValue) => setCountry(newValue.id)}
            required
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

const countries = [
  {
    id: 0,
    name: "usa",
  },
  {
    id: 1,
    name: "canada",
  },
  {
    id: 2,
    name: "united kingdom",
  },
  {
    id: 3,
    name: "australia",
  },
  {
    id: 4,
    name: "germany",
  },
  {
    id: 5,
    name: "spain",
  },
  {
    id: 6,
    name: "portugal",
  },
  {
    id: 7,
    name: "malaysia",
  },
  {
    id: 8,
    name: "france",
  },
  {
    id: 9,
    name: "new zealand",
  },
  {
    id: 10,
    name: "netherlands",
  },
  {
    id: 11,
    name: "italy",
  },
  {
    id: 12,
    name: "switzerland",
  },
  {
    id: 13,
    name: "iran",
  },
  {
    id: 14,
    name: "austria",
  },
  {
    id: 15,
    name: "finland",
  },
  {
    id: 16,
    name: "romania",
  },
  {
    id: 17,
    name: "dominican republic",
  },
  {
    id: 18,
    name: "brazil",
  },
  {
    id: 19,
    name: "england, united kingdom",
  },
  {
    id: 20,
    name: "japan",
  },
  {
    id: 21,
    name: "philippines",
  },
  {
    id: 22,
    name: "ireland",
  },
  {
    id: 23,
    name: "china",
  },
  {
    id: 24,
    name: "sweden",
  },
  {
    id: 25,
    name: "belgium",
  },
  {
    id: 26,
    name: "qatar",
  },
  {
    id: 27,
    name: "norway",
  },
  {
    id: 28,
    name: "us",
  },
  {
    id: 29,
    name: "mexico",
  },
  {
    id: 30,
    name: "new york, georgia, usa",
  },
  {
    id: 31,
    name: "singapore",
  },
  {
    id: 32,
    name: "hong kong",
  },
  {
    id: 33,
    name: "canary islands, spain",
  },
  {
    id: 34,
    name: "taiwan",
  },
  {
    id: 35,
    name: "south africa",
  },
  {
    id: 36,
    name: "poland",
  },
  {
    id: 37,
    name: "far away...",
  },
  {
    id: 38,
    name: "argentina",
  },
  {
    id: 39,
    name: "india",
  },
  {
    id: 40,
    name: "greece",
  },
  {
    id: 41,
    name: "costa rica",
  },
  {
    id: 42,
    name: "united states",
  },
  {
    id: 43,
    name: "kuwait",
  },
  {
    id: 44,
    name: "united state",
  },
  {
    id: 45,
    name: "okinawa, japan",
  },
  {
    id: 46,
    name: "new york, usa",
  },
  {
    id: 47,
    name: "denmark",
  },
  {
    id: 48,
    name: "cambridgeshire, united kingdom",
  },
  {
    id: 49,
    name: "czech republic",
  },
  {
    id: 50,
    name: "phillipines",
  },
  {
    id: 51,
    name: "england",
  },
  {
    id: 52,
    name: "burma",
  },
  {
    id: 53,
    name: ",",
  },
  {
    id: 54,
    name: "antarctica",
  },
  {
    id: 55,
    name: "israel",
  },
  {
    id: 56,
    name: "chile",
  },
  {
    id: 57,
    name: "south korea",
  },
  {
    id: 58,
    name: "euskal herria",
  },
  {
    id: 59,
    name: "venezuela",
  },
  {
    id: 60,
    name: "iceland",
  },
  {
    id: 61,
    name: "trinidad and tobago",
  },
  {
    id: 62,
    name: "bahamas",
  },
  {
    id: 63,
    name: "west yorkshire, united kingdom",
  },
  {
    id: 64,
    name: "virginia, usa",
  },
  {
    id: 65,
    name: "dc, usa",
  },
  {
    id: 66,
    name: "illinois, usa",
  },
  {
    id: 67,
    name: "bulgaria",
  },
  {
    id: 68,
    name: "u.s.a.",
  },
  {
    id: 69,
    name: "turkey",
  },
  {
    id: 70,
    name: "universe",
  },
  {
    id: 71,
    name: "saint lucia",
  },
  {
    id: 72,
    name: "british columbia, canada",
  },
  {
    id: 73,
    name: "luxembourg",
  },
  {
    id: 74,
    name: "laos",
  },
];
