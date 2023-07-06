const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 3000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB Atlas:", error);
  });

// Import các module định tuyến
const signupRouter = require("./routes/auth/signup");
const loginRouter = require("./routes/auth/login");

// Sử dụng các module định tuyến
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
