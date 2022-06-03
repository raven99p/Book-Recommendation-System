import { MongoClient } from "mongodb";

export default async function processedUpload(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      if (req.body) {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const users = db.collection("Users");
        let result = await users.findOne({ username: req.body.username });
        if (result) {
          res.status(406);
          res.json({ message: "Username Already Exists" });
        } else {
          const lastId = await users.find().sort({userId: -1}).limit(1).toArray();
          result = await users.insertOne({
            userId: lastId[0].userId + 1,
            username: req.body.username,
            passwordHash: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            country: req.body.country,
          });
            console.log(result);
          if (result.insertedId) {
            res.status(200);
            res.send();
          } else {
            res.status(500);
            res.send();
          }
        }
      }
    } else {
      res.status(405);
      res.json({ message: "Unacceptable method" });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send();
  }
}
