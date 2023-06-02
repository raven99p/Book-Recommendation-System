import { EncryptJWT } from "jose/jwt/encrypt";
import { createSecretKey } from "crypto";
import { MongoClient } from "mongodb";

export default async function login(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);
      // TODO: add DB lookup
      const client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      const db = client.db("ecommerce");
      const users = db.collection("Users");
      console.log(req.body);
      const user = await users.findOne(
        { username: req.body.email, passwordHash: req.body.password }
        // { email: req.body.email, passwordHash: req.body.password },
      );
      console.log("This is the user:", user);
      if (user?.username) {
        const secretKey = await createSecretKey(
          Buffer.from(process.env.JWT_KEY)
        );
        // const secret = await generateSecret('HS256');
        // console.log(secretKey);
        const jwt = await new EncryptJWT({ username: user.username })
          .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
          .setExpirationTime("4h")
          .encrypt(secretKey);
        console.log("My", jwt);
        console.log("setting cookie");
        const date = new Date();
        date.setHours(date.getHours + 2);
        res.setHeader(
          "Set-Cookie",
          `ReadersCove=${jwt}; HttpOnly; Path=/; Max-Age=${60 * 60 * 2}`
        );
        console.log("set cookie");
        res.status(200);
        res.json({ message: "OK", username: user.username });
      } else {
        res.status(406);
        res.json({ message: "User Not Found" });
      }
    } else {
      res.status(405).send();
    }
  } catch (err) {
    console.log("this was the error");
    res.status(500);
    res.send();
  }
}
