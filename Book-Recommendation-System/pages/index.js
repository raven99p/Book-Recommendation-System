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
export async function getServerSideProps(context) {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/getFrontPageBooks"
    );
    console.log(response.data);
    return {
      props: {
        books: response.data.books,
      },
    };
  } catch (err) {
    console.log(err);
  }
}

export default function Index({ books }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [partialTitle, setpartialTitle] = useState("");
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const getBooksAutoComplete = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getBooksAutoComplete",
          {
            partialTitle,
          }
        );
        if (response.status === 200) {
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    return () => {};
  }, [open]);

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
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onInputChange={(e) => setpartialTitle(e.target.value)}
            getOptionLabel={(option) => option.title}
            options={options}
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
              {books.map((book) => {
                return (
                  <Card
                    sx={{
                      width: "29%",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
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
                      <Typography style={{ marginTop: "1em", color: "green" }}>
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
                );
              })}
            </Box>
            <Box display="flex" justifyContent="center">
              <Pagination count={10} color="primary" />
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
