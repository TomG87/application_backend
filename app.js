const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const mongoConnet = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};

mongoConnet();

app.get("/", (req, res) => {
  res.send("Testing");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
