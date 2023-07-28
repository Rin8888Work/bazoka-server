require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { API_CONFIGS } = require("./config/api");
const { responseJson } = require("./helpers");
const verifyRequest = require("./helpers/verifyRequest");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB Atlas:", error);
  });

API_CONFIGS.forEach(({ prefix, items }) => {
  items.forEach((api) => {
    app.use(
      `${prefix}${api.path}`,
      (req, res, next) => verifyRequest(req, res, next, api.type),
      api.handle
    );
  });
});

app.get("/", (req, res) => {
  responseJson({ res, message: "Không có gì ở đây đâu ạ!" });
});

app.use((req, res) => {
  responseJson({ res, message: "Route not found!", statusCode: 404 });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
