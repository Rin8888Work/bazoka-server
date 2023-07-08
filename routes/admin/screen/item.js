const express = require("express");
const { Screen } = require("../../../models/ScreenSchema");
const {
  responseJson,
  responseCatchError,
  convertIdToObjectId,
} = require("../../../helpers");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const _id = await convertIdToObjectId(res, id);
    if (!_id) return;

    const screen = await Screen.aggregate([
      {
        $match: { _id },
      },
      {
        $graphLookup: {
          from: "screens",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "children",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "roleAccess",
          foreignField: "_id",
          as: "roleAccess",
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageAccess",
          foreignField: "_id",
          as: "packageAccess",
        },
      },
      {
        $unwind: {
          path: "$children",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "children.roleAccess",
          foreignField: "_id",
          as: "children.roleAccess",
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "children.packageAccess",
          foreignField: "_id",
          as: "children.packageAccess",
        },
      },
      {
        $sort: {
          "children.order": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          mergedRoot: {
            $mergeObjects: "$$ROOT",
          },
          children: { $push: "$children" },
        },
      },
      {
        $addFields: {
          children: {
            $filter: {
              input: "$children",
              as: "child",
              cond: {
                $and: [
                  { $ne: ["$$child.roleAccess", []] },
                  { $ne: ["$$child.packageAccess", []] },
                ],
              },
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$mergedRoot", { children: "$children" }],
          },
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
    ]);

    responseJson({
      res,
      statusCode: 200,
      message: "Thông tin Screen",
      data: screen[0],
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;
