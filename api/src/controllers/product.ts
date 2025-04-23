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
  addProductValidator,
  editProductValidator,
} from "../validators";
import { IProduct, Product } from "../models";
import { BadRequest } from "../customErrors";
import { uploadLocal } from "../constants/lib";
import CONFIG from "../config";
import fs from "fs/promises";
import path from "path";

const router = Router();

type AddProduct = IProduct & {};

type ParamsWithId = {
  id: string;
};

type ProductFilter = {
  name?: string;
  description?: string;
  price_gt?: string;
  price_lt?: string;
  limit: string;
  page: string;
};

// get / filter products
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, page, name, description, price_gt, price_lt } =
      req.query as ProductFilter;

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

    if (price_gt) {
      toQuery = { ...toQuery, price: { $gte: parseInt(price_gt) } };
    }

    if (price_lt) {
      toQuery = { ...toQuery, price: { $lte: parseInt(price_lt) } };
    }

    const productCount = await Product.countDocuments(toQuery);

    // take the same query from above and write a aggregation query
    const products = await Product.aggregate([
      { $match: toQuery },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1 } },
    ]);

    res.json({
      data: products,
      hasNext: parseInt(limit) * parseInt(page) < productCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// add route
router.post(
  "/",
  uploadLocal.single("image"),
  validate(addProductValidator),
  dbCheckBody(Product, "name"),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, description, price } = req.body as AddProduct;
      const image = req.file as Express.Multer.File;

      if (image) {
        await Product.create({
          name,
          description,
          price,
          image: `${CONFIG.HOST}/static/uploads/${image.filename}`,
        });
      } else {
        await Product.create({
          name,
          description,
          price,
        });
      }

      res.json({ msg: "Product added successfully" });
    } catch (error: any) {
      if (!req.file) {
        throw new BadRequest("Image is required");
      }

      const stats = await fs.stat(req.file.path);

      if (stats.isFile()) {
        await fs.unlink(req.file.path);
      }

      throw error;
    }
  })
);

// update route
router.put(
  "/:id",
  uploadLocal.single("image"),
  validate(idValidater),
  validate(editProductValidator),
  dbCheckBodyUpdate(Product, "name"),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params as ParamsWithId;

      const image = req.file as Express.Multer.File;

      const product = await Product.findById(id);

      if (!product) {
        throw new BadRequest(`Product with id ${id} not found`);
      }

      if (product.image && image) {
        const split = product.image.split("/");
        const fileName = split[split.length - 1];
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          fileName
        );

        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          await fs.unlink(path.join(filePath));
        }
      }

      if (image) {
        req.body.image = `${CONFIG.HOST}/static/uploads/${image.filename}`;
      }

      await Product.findByIdAndUpdate(id, { ...req.body });

      res.json({ msg: "Product updated successfully" });
    } catch (error: any) {
      if (req.file) {
        const stats = await fs.stat(req.file.path);

        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }

      throw error;
    }
  })
);

// delete route
router.delete(
  "/:id",
  validate(idValidater),
  dbDelete(Product),
  asyncHandler(async (req: Request, res: Response) => {
    const { image } = req.prevObject;

    if (image) {
      const split = image.split("/");
      const fileName = split[split.length - 1];
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        await fs.unlink(filePath);
      }
      console.log("File with name", fileName, "deleted successfully");
    }
    res.json({ msg: "Product deleted successfully" });
  })
);


// Get product by ID route
router.get(
  "/:id", // Define route with dynamic parameter `id`
  validate(idValidater), // Validate the ID
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as ParamsWithId; // Typing for `id` in params

    try {
      // Find product by ID
      const product = await Product.findById(id);

      // If product not found, throw a bad request error
      if (!product) {
        throw new BadRequest(`Product with id ${id} not found`);
      }

      // Respond with the product data
      res.json({
        data: product,
      });
    } catch (error: any) {
      throw error; // Re-throw error if caught
    }
  })
);



export default router;
