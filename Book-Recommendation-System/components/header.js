import { React, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Menu, MenuItem, Box, Avatar } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import router from "next/router";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function header({ user, changeUserState, isAdmin }) {
  const [userState, setuserState] = useState(null);
  // const [adminState, setAdminState] = useState(null);

  useEffect(() => {
    try {
      const resp = axios
        .post("/api/getUserName")
        .then((value) => {
          setuserState(value.data.username);
        })
        .catch(() => {});
    } catch (err) {
      console.log(err);
    }
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  async function handleLogout() {
    const resp = await axios.post("/api/logout");
    console.log(resp);
    changeUserState(null);
    router.push("/login");
  }
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ marginBottom: "10%", background: "#112" }}
      >
        <Toolbar style={{ height: 95, background: "#112" }}>
          <span>
            <Typography variant="h6" noWrap>
              {"Welcome to "}
              <Link color="inherit" href="/user/userHome">
                <a style={{ textDecoration: "none", color: "white" }}>
                  Reader's Cove
                </a>
              </Link>{" "}
            </Typography>
          </span>
          {user && (
            <Box style={{ marginLeft: "75%" }}>
              <Button
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ textTransform: "none" }}
                startIcon={<Avatar />}
                endIcon={<ArrowDropDownIcon />}
              >
                {user}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <Link href="/user/home" passHref>
                    <a href="/user/home" style={{ textDecoration: "none" }}>
                      Home
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href={`/user/${user}`} passHref>
                    <a
                      href={`/user/${user}`}
                      style={{ textDecoration: "none" }}
                    >
                      Profile
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
