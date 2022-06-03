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
        const books = db.collection("Books");
        let result = await books
          .find({
            title: { $regex: `.*${req.body.inputValue}.*`, $options: "i" },
          })
          .limit(5)
          .toArray();
        console.log(result);
        if (result) {
          res.status(200);
          res.json(result);
        } else {
          res.status(200);
          res.send([]);
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
