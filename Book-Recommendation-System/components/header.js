import { React, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Menu, MenuItem, Box, Avatar, Badge } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import router from "next/router";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";
export default function header({ user, changeUserState, isAdmin }) {
  const [userState, setuserState] = useState(null);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);
  // const [adminState, setAdminState] = useState(null);
  useEffect(() => {
    try {
      const fetchName = async () => {
        try {
          const resp = await axios.post("/api/getUserName");
          setuserState(resp.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchName();
    } catch (err) {
      console.log(err);
    }
  }, []);
  useEffect(() => {
    setNumberOfItemsInCart(getNumOfItemsInCart());
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
    setuserState(null);
    router.push("/login");
  }
  const getNumOfItemsInCart = () => {
    if (window.localStorage) {
      const myLocalStorage = window.localStorage;
      const cart = JSON.parse(myLocalStorage.getItem("ReadersCoveCart"));
      if (cart) {
        return cart.length;
      } else return 0;
    }
    return 0;
  };
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#112" }}>
        <Toolbar
          style={{
            height: 95,
            background: "#112",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "inline" } }}>
            <Typography variant="h6" noWrap>
              {"Welcome to "}
              <Link color="inherit" href="/">
                <a style={{ textDecoration: "none", color: "white" }}>
                  Reader's Cove
                </a>
              </Link>{" "}
            </Typography>
          </Box>
          <Box
            sx={{
              marginLeft: { xs: "0em", md: "-6em", lg: "-6em" },
              cursor: "pointer",
            }}
          >
            <Link href="/">
              <Image src="/logoWhite.png" width={100} height={100} />
            </Link>
          </Box>
          {console.log(userState)}

          <Box>
            <Button
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ textTransform: "none" }}
              startIcon={<Avatar />}
              endIcon={<ArrowDropDownIcon />}
            >
              {userState?.username ?? "Profile"}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Link href={`/shop`} passHref>
                  <a style={{ textDecoration: "none" }}>Home</a>
                </Link>
              </MenuItem>
              <MenuItem>
                <Badge
                  badgeContent={numberOfItemsInCart}
                  color="primary"
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Link href={`/user/cart`} passHref>
                    <a style={{ textDecoration: "none" }}>Cart</a>
                  </Link>
                </Badge>
              </MenuItem>
              {!userState && (
                <MenuItem>
                  <Link href="/login" passHref>
                    <a style={{ textDecoration: "none" }}>Login</a>
                  </Link>
                </MenuItem>
              )}
              {userState && (
                <MenuItem>
                  <Link href={`/user/${userState.username}`} passHref>
                    <a style={{ textDecoration: "none" }}>Profile</a>
                  </Link>
                </MenuItem>
              )}
              {userState && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
