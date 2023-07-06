// routes/signup.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models/UserSchema");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log({ username, email, password });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ error: "Failed to register user", mess: JSON.stringify(error) });
  }
});

module.exports = router;
