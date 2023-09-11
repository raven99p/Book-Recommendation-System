import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Input,
  Paper,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Pagination,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Link from "next/link";
import { debounce } from "lodash";
import Image from "next/image";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { MongoClient } from "mongodb";

export async function getServerSideProps(context) {
  try {
    try {
      const client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      const db = client.db("ecommerce");
      const books = db.collection("Books");
      const bookProducts = await books
        .find({ averageRating: { $gte: 7.5 } })
        .limit(9)
        .sort({ averageRating: -1 })
        .toArray();
      console.log(bookProducts);
      if (bookProducts) {
        return {
          props: {
            books: JSON.stringify(bookProducts),
          },
        };
      } else {
        return {
          props: {
            books: [],
          },
        };
      }
    } catch (err) {
      return {
        props: {
          books: [],
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        books: [],
      },
    };
  }
}

export default function Index({ books }) {
  const [open, setOpen] = React.useState(false);
  const [frontPageBooks, setFrontPageBooks] = useState(JSON.parse(books));
  const loading = open && autocompleteOptions.length === 0;
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const fetchNewOptions = async (inputValue) => {
    // console.log(inputValue);
    if (inputValue.length > 3) {
      const newOptionsResponse = await axios.post(
        "http://localhost:3000/api/getNewOptions",
        { inputValue }
      );
      setAutocompleteOptions(newOptionsResponse.data);
    }
  };
  const getNewFrontPageBooks = async (newPage) => {
    const newFrontBooksResponse = await axios.post(
      "http://localhost:3000/api/getNewFrontPageBooks",
      { page: newPage }
    );
    if (!!newFrontBooksResponse.data) {
      setFrontPageBooks(newFrontBooksResponse.data);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        backgroundImage: `url(/aboutBG.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        marginTop: "-20em",
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
            Welcome to the Reader's Cove
          </Typography>
          <Autocomplete
            id="asynchronous-demo"
            sx={{
              width: "30rem",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            // open={open}
            // onOpen={() => {
            //   setOpen(true);
            // }}
            // onClose={() => {
            //   setOpen(false);
            // }}
            renderOption={(props, option) => (
              <Link href={`/product/${option.isbn}`}>
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="nowrap"
                  my="1em"
                  mx="1em"
                  sx={{ cursor: "pointer" }}
                  justifyContent="space-between"
                >
                  <Box display="flex" columnGap="1em" alignItems="center">
                    <img
                      src={option.ImageS}
                      alt="image of book"
                      width="40"
                      height="50"
                    />
                    <Typography variant="body2" sx={{ textAlign: "left" }}>
                      {option.title}
                    </Typography>
                  </Box>
                  <DoubleArrowIcon
                    color="primary"
                    size="small"
                    sx={{ position: "relative", float: "right" }}
                  />
                </Box>
              </Link>
            )}
            onInputChange={(e, inputValue) => fetchNewOptions(inputValue)}
            getOptionLabel={(option) => option.title}
            options={autocompleteOptions}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="I'm looking for..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <Paper elevation={3} sx={{ pb: "3em" }}>
            <Box m="3em" display="flex" gap="4em" flexWrap="wrap">
              {frontPageBooks.map((book) => {
                return (
                  <Link key={book.isbn} href={`/product/${book.isbn}`}>
                    <Card
                      sx={{
                        width: "29%",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <CardMedia
                        component="img"
                        width="20"
                        height="200"
                        image={book.ImageM}
                        alt="image of book cover"
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{book.category}</Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {book.summary?.slice(0, 100)}...
                        </Typography>
                        <Typography
                          style={{ marginTop: "1em", color: "green" }}
                        >
                          {book.price}&euro;
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Link href={`/product/${book.isbn}`}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{ borderRadius: "20px", bottom: "0" }}
                          >
                            View
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Link>
                );
              })}
            </Box>
            <Box display="flex" justifyContent="center">
              <Pagination
                count={30}
                color="primary"
                onChange={(e, newPage) => {
                  getNewFrontPageBooks(newPage);
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
