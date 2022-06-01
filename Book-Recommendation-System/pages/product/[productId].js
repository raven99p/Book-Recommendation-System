import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Input,
  Paper,
  Rating,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { productId } = context.params;
  console.log(context.req.headers);
  try {
    const response = await axios.post(
      "http://localhost:3000/api/getProductDetails",
      { productId },
      {
        withCredentials: true,
        headers: {
          Cookie: context.req?.headers?.cookie ?? null,
        },
      }
    );
    const similarBooks = await axios.post(
      "http://127.0.0.1:5000/findSimilarBooks",
      { isbn: productId }
    );
    console.log("SIMILAR BOOKS LIST", similarBooks.data);
    if (response?.data?.product) {
      return {
        props: {
          product: response?.data?.product,
          user: {
            loggedIn: response?.data?.loggedIn ?? null,
            username: response?.data?.username ?? null,
          },
          similarBookList: similarBooks.data.message,
          key: productId,
        },
      };
    }
  } catch (err) {
    console.log(err);
    console.log(err.response);
    if (err?.response?.status === 404) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
  }
}
function Product({ product, user, similarBookList }) {
  const [simBooks, setSimBooks] = useState(similarBookList);
  const [isLoggedIn, setIsLoggedIn] = useState(user.loggedIn);
  const [productAmount, setProductAmount] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarReview, setOpenSnackbarReview] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [disableAddToCard, setDisableAddToCard] = useState(false);
  const [disableSubmitReview, setDisableSubmitReview] = useState(false);
  const [testState, setTestState] = useState(product.isbn);
  const ratingLabels = {
    0: "",
    1: "Poor",
    2: "OK",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  useEffect(() => {
    if (window.localStorage) {
      const myLocalStorage = window.localStorage;
      let trackedProducts = JSON.parse(
        myLocalStorage.getItem("ReadersCoveTracker")
      );
      if (!!trackedProducts) {
        if (!(product.isbn in trackedProducts)) {
          console.log("here");
          console.log(trackedProducts);
          trackedProducts.push(product.isbn.toString());
        }
      } else {
        trackedProducts = [product.isbn.toString()];
        console.log(trackedProducts);
      }

      myLocalStorage.setItem(
        "ReadersCoveTracker",
        JSON.stringify(trackedProducts)
      );
    }
  }, []);

  const handleChangeProductAmount = (e) => {
    if (e.target.value !== "") {
      let onlyNums = e.target.value.replace(/[^0-9]/g, "");
      onlyNums =
        parseInt(onlyNums) < 1 || parseInt(onlyNums) > 10
          ? 10
          : parseInt(onlyNums);
      setProductAmount(onlyNums);
    }
  };
  const handleAddToCart = () => {
    if (window.localStorage) {
      const myLocalStorage = window.localStorage;
      let cart = JSON.parse(myLocalStorage.getItem("ReadersCoveCart"));
      if (cart) {
        cart.push({
          isbn: product.isbn,
          title: product.title,
          amount: productAmount,
          ImageS: product.ImageS,
          price: product.price * productAmount,
        });
      } else {
        cart = [
          {
            isbn: product.isbn,
            title: product.title,
            amount: productAmount,
            ImageS: product.ImageS,
            price: product.price * productAmount,
          },
        ];
      }
      myLocalStorage.setItem("ReadersCoveCart", JSON.stringify(cart));
      setDisableAddToCard(true);
      setOpenSnackbar(true);
    }
  };
  const handleRatingChange = (e) => {
    console.log(ratingValue);
    setRatingValue(e.target.value);
  };
  const handleReviewBodyChange = (e) => {
    setReviewBody(e.target.value);
  };
  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/submitReview",
        {
          ratingValue,
          reviewBody,
          username: user.username,
          isbn: product.isbn,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setDisableSubmitReview(true);
        setOpenSnackbarReview(true);
      }
    } catch (err) {
      console.log(err);
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
      <Container style={{ marginTop: "5em", marginBottom: "5em" }}>
        <Paper elevation={3} sx={{ pb: "3em" }}>
          <Grid container>
            <Grid item xs={1} md={1} />
            <Grid item xs={10} md={6}>
              <Box marginTop="3em" marginBottom="3em">
                <Image
                  style={{ borderRadius: "10px" }}
                  width={400}
                  height={500}
                  alt="Image of product"
                  src={`${product.ImageL}`}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                alignText="center"
                marginTop="5rem"
                rowGap="1em"
                marginBottom="2em"
                sx={{ padding: { xs: "3em", md: "0em" } }}
              >
                <Typography variant="h4">{product.title}</Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="nowrap"
                  columnGap="2em"
                >
                  <Rating
                    value={product.averageRating}
                    readOnly
                    precision={0.5}
                  />
                  <Typography variant="h6">
                    {`${product.averageRating}      ${
                      ratingLabels[`${Math.round(product.averageRating)}`]
                    }`}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {product?.stock > 0 ? (
                    <Typography variant="subtitle1" color="green">
                      Available Now!
                    </Typography>
                  ) : (
                    <Typography color="red" variant="subtitle1">
                      Out of Stock
                    </Typography>
                  )}
                  <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle1" color="gray">
                      By: {product.author}
                    </Typography>
                    <Typography variant="subtitle1" color="gray">
                      Published: {product.YOP}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6">{product.summary}</Typography>
                <Box
                  marginTop="1em"
                  display="flex"
                  flexWrap="none"
                  justifyContent="space-between"
                >
                  <Typography variant="h6" color="green">
                    {product.price}&euro;
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() =>
                        setProductAmount(
                          productAmount > 1 ? productAmount - 1 : productAmount
                        )
                      }
                    >
                      <RemoveIcon fontSize="small" sx={{ color: "blue" }} />
                    </IconButton>
                    <Input
                      sx={{
                        textAlign: "right",
                        color: "black",
                        width: "1rem",
                        marginX: "1em",
                      }}
                      value={productAmount}
                      variant="standard"
                      disabled
                      color="primary"
                      disableUnderline
                      onChange={(e) => handleChangeProductAmount(e)}
                    />
                    <IconButton
                      onClick={() =>
                        setProductAmount(
                          productAmount < 10 ? productAmount + 1 : productAmount
                        )
                      }
                    >
                      <AddIcon fontSize="small" sx={{ color: "blue" }} />
                    </IconButton>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  disabled={disableAddToCard}
                  style={{ marginTop: "1em", borderRadius: "30px" }}
                  endIcon={<AddShoppingCartIcon size="small" />}
                  onClick={() => handleAddToCart()}
                >
                  Add To Cart
                </Button>
                <Snackbar
                  open={openSnackbar}
                  anchorOrigin={{ horizontal: "center", vertical: "top" }}
                  autoHideDuration={6000}
                  onClose={() => setOpenSnackbar(false)}
                >
                  <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    sx={{ backgroundColor: "green", color: "white" }}
                  >
                    Product Added To Cart Successfully!
                  </Alert>
                </Snackbar>
                <Link href="/user/cart">
                  <Button
                    variant="contained"
                    style={{ marginTop: "1em", borderRadius: "20px" }}
                    endIcon={<ShoppingCartCheckoutIcon size="small" />}
                  >
                    View Cart
                  </Button>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={1} md={1} />
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            rowGap="4em"
            marginLeft="3em"
          >
            {isLoggedIn && (
              <>
                <Divider />
                <Typography variant="h4">Review this Product</Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  rowGap="2em"
                  justifyContent="flex-end"
                  width="fit-content"
                >
                  <Box display="flex" flexDirection="row" columnGap="1em">
                    <Rating
                      value={ratingValue}
                      precision={1}
                      onChange={(e) => handleRatingChange(e)}
                    />
                    <Typography variant="h6">
                      {`${ratingValue}      ${
                        ratingLabels[`${Math.round(ratingValue)}`]
                      }`}
                    </Typography>
                  </Box>

                  <TextField
                    // fullWidth
                    sx={{ width: { xs: "20rem", md: "30rem" } }}
                    placeholder="Share your thoughts..."
                    multiline
                    onChange={(e) => handleReviewBodyChange(e)}
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      disabled={disableSubmitReview}
                      sx={{ float: "left", width: "5em", borderRadius: "30px" }}
                      onClick={() => handleReviewSubmit()}
                    >
                      Submit
                    </Button>
                    <Snackbar
                      open={openSnackbarReview}
                      anchorOrigin={{
                        horizontal: "center",
                        vertical: "bottom",
                      }}
                      autoHideDuration={6000}
                      onClose={() => setOpenSnackbarReview(false)}
                    >
                      <Alert
                        onClose={() => setOpenSnackbarReview(false)}
                        severity="success"
                        sx={{ backgroundColor: "green", color: "white" }}
                      >
                        Review Submitted Successfully
                      </Alert>
                    </Snackbar>
                  </Box>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="column" rowGap="3em">
                  <Typography variant="h4">
                    Users Like You Also Liked:{" "}
                  </Typography>
                  <Grid container spacing={2}>
                    {[1, 2, 3].map(() => {
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
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {product.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
                <Divider />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            sx={{ mx: "3em" }}
            rowGap="3em"
          >
            <Divider />
            <Typography variant="h4">Similar Products:</Typography>
            <Grid container spacing={2}>
              {simBooks.length != 0 ? (
                simBooks.map((item) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Card sx={{ maxWidth: "80%", borderRadius: "10px" }}>
                        <CardMedia
                          component="img"
                          width="20"
                          height="200"
                          image={item.ImageL}
                          alt="image of book cover"
                        />
                        <CardContent>
                          <Typography>{item.category}</Typography>
                          <Typography gutterBottom variant="h5" component="div">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.summary}
                          </Typography>
                          <Typography style={{ marginTop: "1em" }}>
                            {item.price}&euro;
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Link href={`/product/${item.isbn}`} passHref replace>
                            <Button
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{ borderRadius: "20px" }}
                            >
                              View
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <div>There are no similar books worth recommending</div>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default Product;
