require("dotenv").config();
const express = require("express");
const cors = require("cors");
 

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message)
})

const app = express();

app.use(cors());
app.use(express.json());
 
//WORKS
// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    sql = `select * from restaurants left join (select restaurant_id, COUNT(*), AVG(rating) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;` 
    db.all(sql, [], (err,rows) =>{
      console.log(rows)
      if (err) return console.error(err.message)

      res.status(200).json({
        status: "success",
        results: rows.length,
        data: {
          restaurants: rows,
        },

      });
    })

  } catch (err) {
    console.log(err);
  }
});


//Get a Restaurant
FIXME: //need to be work on 
FIXME: https://www.youtube.com/watch?v=ZRYn6tgnEgM&ab_channel=CodingWithMike
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    sql = `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1`
    db.run(
      sql,
      [req.params.id],
      (err, results) => {
        if (err) return console.error(err.message);
        console.log(results);
    console.log(reviews);

    res.status(200).json({
      status: "succes",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  }
)
  } catch (err) {
    console.log(err);
  }
});

// Create a Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  console.log(req.body);

  try {

    sql = `INSERT INTO restaurants (id, name, location, price_range) values ($1, $2, $3, $4) returning *`
    db.run(
      sql,
      [ Math.random(1, 1000), req.body.name, req.body.location, req.body.price_range],
      (err, results) => {
        if (err) return console.error(err.message);
        console.log(results);
        res.status(201).json({
          status: "succes",
          data: {
            restaurant: {restaurant : results},
          },
        });
      }
    )
    
  } catch (err) {
    console.log(err);
  }
});

TODO: TEST 
// Update Restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    sql = `UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *` 

    db.run(
      sql,
      [req.body.name, req.body.location, req.body.price_range, req.params.id],
      (err, results) => {
        if (err) return console.error(err.message);
        res.status(200).json({
          status: "succes",
          data: {
            restaurant: {restaurant : results},
          },
        });
      }
    )
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

// Delete Restaurant
TODO: TEST
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    sql = `DELETE FROM restaurants where id = $1`
   
    db.run(
      sql,
      [req.params.id],
      (err) => {
        if (err) return console.error(err.message);
        res.status(204).json({
          status: "sucess",
        });
      }
    )
  } catch (err) {
    console.log(err);
  }
});
FIXME: WORK
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.run.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
