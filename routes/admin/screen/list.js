const express = require("express");
const { Screen } = require("../../../models/ScreenSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const screens = await Screen.aggregate([
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
          from: "licenses",
          localField: "licenseAccess",
          foreignField: "_id",
          as: "licenseAccess",
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
          from: "licenses",
          localField: "children.licenseAccess",
          foreignField: "_id",
          as: "children.licenseAccess",
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
                  { $ne: ["$$child.licenseAccess", []] },
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

    const rootScreens = screens.filter((screen) => !screen.parent);

    responseJson({
      res,
      statusCode: 200,
      message: "Danh sách Screens",
      data: rootScreens,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;
