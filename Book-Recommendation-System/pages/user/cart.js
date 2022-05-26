import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

function Cart() {
  const [cartProducts, setCartProducts] = useState();
  useEffect(() => {
    setCartProducts(
      window ? JSON.parse(window.localStorage.getItem("ReadersCoveCart")) : null
    );
  }, []);

  const removeFromCart = (product) => {
    if (window) {
      const myLocalStorage = window.localStorage;
      let cart = JSON.parse(myLocalStorage.getItem("ReadersCoveCart"));
      cart = cart.filter((book) => {
        book.isbn !== product.isbn;
      });
      myLocalStorage.setItem("ReadersCoveCart", JSON.stringify(cart));
      setCartProducts(cart);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundImage: `url(/aboutBG.jpg)`,
        marginTop: "-10em",
        gap: "5em",
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt="10rem"
          rowGap="3em"
        >
          <Typography variant="h3" color="white">
            Your Cart
          </Typography>
          <Paper
            elevation={3}
            sx={{ p: "3em", m: "3em", minWidth: { sx: "30rem", md: "60rem" } }}
          >
            {cartProducts?.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: { sx: "30rem", md: "60rem" } }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">ISBN</TableCell>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartProducts?.map((row) => (
                        <TableRow
                          key={row.title}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Image
                              src={`${row.ImageS}`}
                              width="30"
                              height="40"
                            />
                          </TableCell>
                          <TableCell align="center">{row.isbn}</TableCell>
                          <TableCell align="center">{row.title}</TableCell>
                          <TableCell align="center">{row.amount}</TableCell>
                          <TableCell align="center">
                            {row.price}&euro;
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={(row) => removeFromCart(row)}>
                              <CloseIcon sx={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Total:
                        </TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">
                          {
                            cartProducts.reduce(
                              (prev, curr) => prev.price + curr.price
                            ).price
                          }
                          &euro;
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  mt="3em"
                  columnGap="3em"
                >
                  <Button variant="contained" color="error">
                    Back
                  </Button>
                  <Button variant="contained">Procced to Checkout</Button>
                </Box>{" "}
              </>
            ) : (
              <Box textAlign="center">
                <Typography variant="h5">No Items In Cart</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Cart;
