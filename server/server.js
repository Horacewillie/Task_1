const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require("morgan");

const app = express();

require("dotenv").config();
const port = process.env.PORT || 3002;
const localhost = process.env.HOST;

/******* MIDDLEWARES *********/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(morgan("tiny"));

app.use(express.static('client/build'))

/******* MODEL *********/
const { Post } = require("./models/post");

/******* MONGOOSE CONNECTION *********/
const mongooseConnect = (callback) => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((client) => {
      console.log(
        `Mongodb Connected Successfully, running on ${client.connection._connectionString}`
      );
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

/******* ENDPOINT *********/
app.post("/api/contact-me", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Fields must be complete!" });
  }
  const post = new Post(req.body);
  post
    .save()
    .then((post) => {
      return res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: err,
      });
    });
});

if( process.env.NODE_ENV === 'production'){
  const path = require('path')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}

mongooseConnect(() =>
  app.listen(port, () => {
    console.log(`Server is running at http://${localhost}:${port}`);
  })
);
