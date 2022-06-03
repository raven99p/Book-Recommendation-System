import axios from "axios";
import _ from "lodash";
import { MongoClient } from "mongodb";
import { useDebugValue } from "react";

export default async function getUserSimilarBooks(req, res) {
  try {
    if (req.method === "POST") {
      // console.log('it was a post method');
      // console.log(req);

      if (req.body) {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("ecommerce");
        const users = db.collection("Users");
        const books = db.collection("Books");
        // const reviews = db.collection("Reviews");
        let user = await users.findOne({ username: req.body.username });
        const categories = req.body.source.map((book) => book.category);
        console.log(categories);
        var mostCommonCategory = _.head(
          _(categories).countBy().entries().maxBy(_.last)
        );
        console.log("This is the most common: ", result);
        const simBooksResponse = await axios.post(
          "http://localhost:5000/recommendMeBooks",
          {
            user_data: {
              user_id: user._id.toString(),
              age: user.age,
              country: user.country,
              category: mostCommonCategory,
            },
          }
        );
        console.log(simBooksResponse.data);
        //      # user_data = {
        // # "user_id": int,
        // # "age": float,
        // # "country": int code,
        // # "category": string}
        // let topCategory = await books
        //   .find({
        //     isbn: { $in: [...req.body.source] },
        //   })
        //   .toArray();
        // console.log(topCategory);
        // const addReviewResponse = await axios.post(
        //   "http://localhost:5000/addReview",
        //   {
        //     user_data: {
        //       user_id: user._id.toString(),
        //       age: user.age,
        //       country: user.country,
        //       category: req.body.catergory,
        //     },
        //   }
        // );
        // console.log(addReviewResponse.data);
        res.status(200).send(simBooksResponse.data.message);
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
