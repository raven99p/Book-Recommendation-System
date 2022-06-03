import axios from "axios";
import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";
import { MongoClient } from "mongodb";

export default async function getCartRecommendations(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      const { jwt } = req?.cookies;
      const { trackedBooks } = req?.body;
      //   console.log(req.cookies);
      console.log(trackedBooks);
      const secretKey = await createSecretKey(Buffer.from(process.env.JWT_KEY));
      // const secretKey = await generateSecret('HS256');
      console.log("jwt", jwt);
      try {
        if (typeof jwt !== "undefined") {
          const { payload } = await jwtDecrypt(jwt, secretKey);
          console.log("jwt exists, logged in true");
          if (!!trackedBooks) {
            const trackedBooksResponse = await axios.post(
              "http://127.0.0.1:5000/findSimilarBooksClicks",
              { isbn_list: trackedBooks }
            );
            if (!!trackedBooksResponse.data.message) {
              res.status(200).send(trackedBooksResponse.data.message);
            }
          } else {
            res.status(400).send();
          }
        } else {
          console.log("jwt undefined");
          if (!!trackedBooks) {
            console.log("tracked: ", trackedBooks);
            const trackedBooksResponse = await axios.post(
              "http://127.0.0.1:5000/findSimilarBooksClicks",
              { isbn_list: trackedBooks }
            );
            console.log("Data from call: ", trackedBooksResponse.data);
            if (!!trackedBooksResponse.data.message) {
              res.status(200).send(trackedBooksResponse.data.message);
            }
          } else {
            res.status(400).send();
          }
        }
      } catch (err) {
        if (!!ReadersCoveTracker) {
          console.log("Tracker", ReadersCoveTracker);
          const trackedBooksResponse = await axios.post(
            "http://127.0.0.1:5000/findSimilarBooksClicks",
            { isbn_list: ReadersCoveTracker }
          );
          if (!!trackedBooksResponse.data.message) {
            res.status(200).send(trackedBooksResponse.data.message);
          } else {
            res.status(400).send();
          }
        }
      }
    } else {
      res.status(405);
      res.json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send("Internal Server Error");
  }
}
