import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";
import { MongoClient } from "mongodb";

export default async function getFrontPageBooks(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const books = db.collection("Books");
        const bookProducts = await books
          .find({ averageRating: { $gte: 3.75 } })
          .limit(9)
          .sort({ averageRating: -1 })
          .toArray();
        if (bookProducts) {
          res.status(200).json({ books: bookProducts });
        } else {
          res.status(404).send("Book not found");
        }
      } catch (err) {
        console.log(err);
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
