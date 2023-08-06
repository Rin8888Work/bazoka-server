const express = require("express");
const request = require("request");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { url } = req.query;
    // Gửi yêu cầu tới URL hình ảnh và chuyển tiếp response cho client
    request(decodeURIComponent(url)).pipe(res);
  } catch (error) {
    console.error("Error during proxy request:", error.message);
    res.status(500).send("Proxy request failed.");
  }
});

module.exports = router;
