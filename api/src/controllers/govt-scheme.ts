import asyncHandler from "../middlewares/AsyncHandler";
import { Request, Response } from "express";
import { Router } from "express";
import {
  dbCheckBody,
  dbCheckBodyUpdate,
  dbDelete,
  validate,
} from "../middlewares/Validator";
import {
  idValidater,
  addGovtSchemeValidator,
  editGovtSchemeValidator,
} from "../validators";
import { GovtScheme, IGovtScheme } from "../models";

const router = Router();

type AddGovtScheme = IGovtScheme & {};

type ParamsWithId = {
  id: string;
};

type GovtSchemeFilter = {
  name?: string;
  description?: string;
  link?: string;
  limit: string;
  page: string;
};

// get / filter products
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, page, name, description, link } =
      req.query as GovtSchemeFilter;

    let toQuery = {};

    if (name) {
      toQuery = {
        ...toQuery,
        name: {
          $regex: name,
          $options: "i",
        },
      };
    }

    if (description) {
      toQuery = {
        ...toQuery,
        description: {
          $regex: description,
          $options: "i",
        },
      };
    }

    if (link) {
      toQuery = {
        ...toQuery,
        link: {
          $regex: link,
          $options: "i",
        },
      };
    }

    const govtSchemeCount = await GovtScheme.countDocuments(toQuery);

    const govtSchemes = await GovtScheme.aggregate([
      { $match: toQuery },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      { $project: { _id: 1, name: 1, description: 1, link: 1 } },
    ]);

    res.json({
      data: govtSchemes,
      hasNext: parseInt(limit) * parseInt(page) < govtSchemeCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// add route
router.post(
  "/",
  validate(addGovtSchemeValidator),
  dbCheckBody(GovtScheme, "name"),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, link } = req.body as AddGovtScheme;

    await GovtScheme.create({
      name,
      description,
      link,
    });

    res.json({ msg: "Govt Scheme added successfully" });
  })
);

// update route
router.put(
  "/:id",
  validate(idValidater),
  validate(editGovtSchemeValidator),
  dbCheckBodyUpdate(GovtScheme, "name"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as ParamsWithId;
    await GovtScheme.findByIdAndUpdate(id, { ...req.body });
    res.json({ msg: "Govt Scheme updated successfully" });
  })
);

// delete route
router.delete(
  "/:id",
  validate(idValidater),
  dbDelete(GovtScheme),
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ msg: "Govt Scheme deleted successfully" });
  })
);

export default router;
