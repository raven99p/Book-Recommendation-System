import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";
import { MongoClient } from "mongodb";

export default async function getProductDetails(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      const jwt = req.cookies.ReadersCove;
      console.log(req.cookies);
      const secretKey = await createSecretKey(Buffer.from(process.env.JWT_KEY));
      // const secretKey = await generateSecret('HS256');
      console.log("jwt", jwt);
      try {
        if (typeof jwt !== "undefined") {
          const { payload } = await jwtDecrypt(jwt, secretKey);
          console.log("jwt exists, logged in true");
          const client = new MongoClient(process.env.MONGO_URI);
          await client.connect();
          const db = client.db("ecommerce");
          const books = db.collection("Books");
          console.log(req.body);
          const book = await books.findOne({
            isbn: req.body.productId,
          });
          if (book) {
            res
              .status(200)
              .json({
                product: book,
                loggedIn: true,
                username: payload.username,
              });
          } else {
            res.status(404).send("Book not found");
          }
        } else {
          const client = new MongoClient(process.env.MONGO_URI);
          await client.connect();
          const db = client.db("ecommerce");
          const books = db.collection("Books");
          console.log(req.body);
          const book = await books.findOne({
            isbn: req.body.productId,
          });
          if (book) {
            res.status(200).json({ product: book, loggedIn: false });
          } else {
            res.status(404).send("Book not found");
          }
        }
      } catch (err) {
        console.log("not logged in");
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const books = db.collection("Books");
        console.log(req.body);
        const book = await books.findOne({
          isbn: req.body.productId,
        });
        if (book) {
          res.status(200).json({ product: book, loggedIn: false });
        } else {
          res.status(404).send("Book not found");
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
