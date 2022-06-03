import axios from "axios";
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
        // const reviews = db.collection("Reviews");
        let user = await users.findOne({ username: req.body.username });

        console.log(user.userId);
        
        const addReviewResponse = await axios.post(
          "http://localhost:5000/addReview",
          {
            user_id: user.userId,
            age: user.age,
            country: user.country,
            isbn: req.body.isbn,
            category: req.body.category,
            rating: parseFloat(req.body.ratingValue) * 2,
          }
        );
        console.log(addReviewResponse.data);
        res.status(200).send();
        // # user_data = {
        //   # "user_id": int,
        //   # "age": float,
        //   # "country": int code,
        //   # "isbn": string,
        //   # "category": string,
        //   # "rating": float}
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
