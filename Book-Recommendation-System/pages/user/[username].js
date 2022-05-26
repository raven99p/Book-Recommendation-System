import {
  Avatar,
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Table,
  TableRow,
  Button,
  TableCell,
  TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export async function getServerSideProps(context) {
  const nameInURL = context.params.username;
  // console.log(context);
  try {
    const response = await axios.post(
      "http://localhost:3000/api/checkUserExists",
      {
        email: nameInURL,
      },
      {
        withCredentials: true,
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }
    );
    // console.log("Normal");
    console.log(response.data);
    return {
      props: {
        ...response.data,
      },
    };
  } catch (err) {
    // console.log("Diddddddddddddddddddddddddddddddd");
    console.log(err.response);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
export default function profile({ username, firstName, lastName, email }) {
  const router = useRouter();

  return (
    <Container style={{ marginBottom: "50px" }}>
      <Card style={{ borderRadius: "25px" }}>
        <CardContent>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar style={{ width: "20%", height: "20%" }} />
            <br />
            <Typography variant="h3">
              {`${firstName ?? "john"} ${lastName ?? "doe"}`}
            </Typography>
            <br />
            <br />
            <br />
            <Typography
              variant="h4"
              style={{ display: "flex", alignSelf: "flex-start" }}
            >
              Info
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{email ?? "someone@example.com"}</TableCell>
                  <TableCell>
                    <Button variant="contained">Change</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ borderBottom: "none" }}>
                    Username
                  </TableCell>
                  <TableCell style={{ borderBottom: "none" }}>
                    {username ?? "johndoe"}
                  </TableCell>
                  <TableCell style={{ borderBottom: "none" }}>
                    <Button
                      onClick={() => router.push("/updateUsername")}
                      variant="contained"
                    >
                      Change
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box
              style={{
                display: "flex",
                justifyItems: "center",
                flexDirection: "column",
              }}
            >
              <Button
                onClick={() => router.push("/updatePassword")}
                variant="contained"
              >
                Change Password
              </Button>
            </Box>
          </Box>

          <br />
          <br />
          <br />
        </CardContent>
      </Card>
    </Container>
  );
}
