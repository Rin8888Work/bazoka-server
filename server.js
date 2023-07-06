const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({ hello: "Hello, I'm Node.js" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
