import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";
import { MongoClient } from "mongodb";

export default async function processedUpload(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      const jwt = req.cookies.ReadersCove;
      console.log(jwt);
      if (jwt) {
        const secretKey = await createSecretKey(
          Buffer.from(process.env.JWT_KEY)
        );
        const { payload } = await jwtDecrypt(jwt, secretKey);
        console.log("This is the log", payload.username.length !== 0);
        if (payload.username.length !== 0) {
          console.log("entered");
          const client = new MongoClient(process.env.MONGO_URI);
          await client.connect();
          const db = client.db("ecommerce");
          const users = db.collection("Users");
          const reviews = db.collection("Reviews");
          if (req.body.username) {
            console.log("Data");
            const result = await users.findOne({ username: req.body.username });
            if (result) {
              console.log("name exists");
              res.status(406);
              res.json({ message: "Username Already Exists" });
            } else {
              console.log("name doesnt exits");
              const userResult = await users.updateOne(
                { username: payload.username },
                { $set: { username: req.body.username } }
              );
              const reviewsResult = await reviews.updateMany(
                { username: payload.username },
                { $set: { username: req.body.username } }
              );
              if (
                userResult.modifiedCount > 0 ||
                reviewsResult.modifiedCount > 0
              ) {
                res.status(200);
                res.json({ message: "OK" });
              } else {
                res.status(500);
                res.json({ message: "Error" });
              }
            }
          }
        } else {
          res.status(406);
          res.json({ message: "User Not Found" });
        }
      }
    } else {
      res.status(500);
      res.json({ message: "Error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send();
  }
}
