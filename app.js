const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const applicationRoutes = require("./routes/applicationRoute");
const cors = require("cors");
const Application = require("./models/applicationModel");

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

mongoConnect();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.get("/api/applications/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).send("Application not found");
    }
    res.send(application);
  } catch (error) {
    console.error("Error fetching application:", error); // Log the full error object
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => {
  res.send("Testing");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
