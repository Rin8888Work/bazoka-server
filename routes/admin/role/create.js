// routes/role/create.js
const express = require("express");
const { Role } = require("../../../models/RoleSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const role = new Role({ name, code, description });
    await role.save();

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo mới Role thành công",
      data: role,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;
