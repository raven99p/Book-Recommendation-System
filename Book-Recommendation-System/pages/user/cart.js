import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useRouter } from "next/router";
function Cart() {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState();
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setCartProducts(
      window ? JSON.parse(window.localStorage.getItem("ReadersCoveCart")) : null
    );
  }, []);

  useEffect(() => {
    if (window.localStorage) {
      async function getCartRecommendations() {
        try {
          const myLocalStorage = window.localStorage;
          const response = await axios.post(
            "http://localhost:3000/api/getCartRecommendations",
            {
              trackedBooks: JSON.parse(
                myLocalStorage.getItem("ReadersCoveTracker")
              ),
            },
            {
              withCredentials: true,
            }
          );
          console.log("Recommended", response.data);
          setRecommendedBooks(response.data);
        } catch (err) {
          setRecommendedBooks([]);
        }
      }
      getCartRecommendations();
    }
  }, []);

  const removeFromCart = (isbnToRemove) => {
    if (window) {
      const myLocalStorage = window.localStorage;
      let cart = JSON.parse(myLocalStorage.getItem("ReadersCoveCart"));
      cart = cart.filter((book) => book.isbn !== isbnToRemove);
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
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                  <Container
                    maxWidth="small"
                    sx={{ width: "50rem", mt: "3em" }}
                  >
                    <Paper>
                      <Box
                        display="flex"
                        flexDirection="column"
                        padding="3em"
                        textAlign="center"
                        rowGap="2em"
                      >
                        <Typography variant="h6">
                          Please fill out your Billing Information:
                        </Typography>
                        <TextField label="Email Adress" />
                        <TextField label="Country" />
                        <TextField label="Address" />
                        <TextField label="Phone Number" />
                        <TextField label="ZIP Code" />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          columnGap: "3em",
                          paddingRight: "3em",
                          paddingBottom: "3em",
                        }}
                      >
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => setOpenModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="contained" color="primary">
                          Pay
                        </Button>
                      </Box>
                    </Paper>
                  </Container>
                </Modal>
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
                            <IconButton
                              onClick={() => removeFromCart(row.isbn)}
                            >
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
                          {cartProducts.reduce((acc, curr) => {
                            console.log(acc);
                            return acc + curr.price;
                          }, 0)}
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
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => router.back()}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                  >
                    Procced to Checkout
                  </Button>
                </Box>{" "}
              </>
            ) : (
              <Box textAlign="center">
                <Typography variant="h5">No Items In Cart</Typography>
              </Box>
            )}
            <Divider sx={{ my: "3em" }} />
            <Box display="flex" flexDirection="column" rowGap="3em">
              <Typography variant="h4">Users Like You Also Liked: </Typography>
              <Grid container spacing={2}>
                {recommendedBooks.map((product) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Card sx={{ maxWidth: "80%", borderRadius: "10px" }}>
                        <CardMedia
                          component="img"
                          width="20"
                          height="200"
                          image={product.ImageL}
                          alt="image of book cover"
                        />
                        <CardContent>
                          <Typography>{product.category}</Typography>
                          <Typography gutterBottom variant="h5" component="div">
                            {product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.summary}
                          </Typography>
                          <Typography style={{ marginTop: "1em" }}>
                            {product.price}&euro;
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{ borderRadius: "20px" }}
                          >
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Cart;
