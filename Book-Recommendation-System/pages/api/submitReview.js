import { MongoClient } from "mongodb";

export default async function submitReview(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      if (req.body) {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const users = db.collection("Users");
        const reviews = db.collection("Reviews");
        let user = await users.findOne({ username: req.body.username });

        let result = await reviews.findOne({
          username: req.body.username,
          isbn: req.body.isbn,
        });
        if (result) {
          res.status(200);
          res.json({ message: "Review Already Exists" });
        } else {
          result = await reviews.insertOne({
            isbn: req.body.isbn,
            age: user.age,
            category: req.body.category,
            username: req.body.username,
            reviewBody: req.body.reviewBody,
            reviewRating: req.body.ratingValue,
          });
          //   console.log(result);
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
