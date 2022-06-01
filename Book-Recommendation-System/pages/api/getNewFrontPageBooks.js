import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";
import { MongoClient } from "mongodb";

export default async function getFrontPageBooks(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);
      const { page } = req.body;
      try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const books = db.collection("Books");
        const bookProducts = await books
          .find({ averageRating: { $gte: 3.75 } })
          .limit(9)
          // .sort({ averageRating: -1 })
          .skip((page - 1) * 9)
          .toArray();
        if (bookProducts) {
          // console.log("sending book products");
          res.status(200).send(bookProducts);
        } else {
          res.status(404).send("Book not found");
        }
      } catch (err) {
        res.status(500).send("something went wrong");
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
