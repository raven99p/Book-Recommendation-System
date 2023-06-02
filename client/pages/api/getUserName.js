import { createSecretKey } from "crypto";
import { jwtDecrypt } from "jose/jwt/decrypt";

export default async function login(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      const jwt = req.cookies.ReadersCove;
      if (jwt) {
        const secretKey = await createSecretKey(
          Buffer.from(process.env.JWT_KEY)
        );
        // const secretKey = await generateSecret('HS256');
        const { payload } = await jwtDecrypt(jwt, secretKey);
        res.json({ username: payload.username, isAdmin: payload.isAdmin });
      } else {
        res.status(401);
        res.json({ message: "Unauthorized" });
      }
    } else {
      res.status(404);
      res.json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send();
  }
}
