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
        if (payload.username.length !== 0) {
          const client = new MongoClient(process.env.MONGO_URI);
          await client.connect();
          const db = client.db("ecommerce");
          const users = db.collection("Users");
          if (req.body.password) {
            const result = await users.updateOne(
              { username: payload.username },
              {
                $set: {
                  passwordHash: req.body.password,
                },
              }
            );
            if (result.modifiedCount > 0) {
              res.status(200);
              res.json({ message: "OK" });
            } else {
              res.status(500);
              res.json({ message: "Error" });
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
