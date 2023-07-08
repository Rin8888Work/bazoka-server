// routes/role/delete.js
const express = require("express");
const { Role } = require("#/models/RoleSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Role.findByIdAndDelete(id);

    responseJson({
      res,
      statusCode: 200,
      message: "Xóa Role thành công",
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;
