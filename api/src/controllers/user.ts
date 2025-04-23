import asyncHandler from "../middlewares/AsyncHandler";
import { CookieOptions, Request, Response } from "express";
import { Router } from "express";
import {
  dbUserCheckV2,
  dbUserDelete,
  validate,
} from "../middlewares/Validator";
import {
  idValidater,
  addUserValidator,
  editUserValidator,
  roleValidater,
  loginValidator,
  roleParamsValidater,
  roleWithQParamsValidater,
} from "../validators";
import config from "../config";
import { IUser, Admin, Expert, Farmer } from "../models";
import { Role, RoleEnum } from "../types";
import bcrypt from "bcrypt";
import { BadRequest } from "../customErrors";
import { generateJwtToken } from "../constants/lib";
import CONFIG from "../config";
import { Model } from "mongoose";

const router = Router();

type AddUser = IUser & {
  role: Role;
};

type ParamsWithId = {
  id: string;
};

type UserFilter = {
  role: Role;
  name?: string;
  email?: string;
  limit: string;
  page: string;
};

type UserFilterDropdown = {
  q: string;
  role: Role;
};

// get / filter users
router.get(
  "/",
  validate(roleParamsValidater),
  asyncHandler(async (req: Request, res: Response) => {
    const { role, limit, page, name, email } = req.query as UserFilter;

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

    if (email) {
      toQuery = {
        ...toQuery,
        email: {
          $regex: email,
          $options: "i",
        },
      };
    }

    let modelToUse: typeof Model;

    switch (role) {
      case RoleEnum.ADMIN:
        modelToUse = Admin;
        break;
      case RoleEnum.EXPERT:
        modelToUse = Expert;
        break;
      case RoleEnum.FARMER:
        modelToUse = Farmer;
        break;
      default:
        throw new BadRequest("Invalid role");
    }

    const userCount = await Farmer.countDocuments(toQuery);
    const users = await modelToUse.aggregate([
      { $match: toQuery },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      { $project: { _id: 1, name: 1, email: 1 } },
    ]);

    res.json({
      data: users,
      hasNext: parseInt(limit) * parseInt(page) < userCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// get / filter users
router.get(
  "/dropdown",
  validate(roleWithQParamsValidater),
  asyncHandler(async (req: Request, res: Response) => {
    const { q, role } = req.query as UserFilterDropdown;

    let toQuery = {};

    if (q) {
      toQuery = {
        ...toQuery,
        name: {
          $regex: q,
          $options: "i",
        },
        email: {
          $regex: q,
          $options: "i",
        },
      };
    }

    let modelToUse: typeof Model;

    switch (role) {
      case RoleEnum.ADMIN:
        modelToUse = Admin;
        break;
      case RoleEnum.EXPERT:
        modelToUse = Expert;
        break;
      case RoleEnum.FARMER:
        modelToUse = Farmer;
        break;
      default:
        throw new BadRequest("Invalid role");
    }

    const users = await modelToUse.aggregate([
      { $match: toQuery },
      { $sort: { createdAt: -1 } },
      { $project: { _id: 1, name: 1 } },
    ]);

    res.json(users);
  })
);

// login route
router.post(
  "/login",
  validate(loginValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body as AddUser;

    let user;

    switch (role) {
      case RoleEnum.ADMIN:
        user = await Admin.findOne({ email });
        break;
      case RoleEnum.EXPERT:
        user = await Expert.findOne({ email });
        break;
      case RoleEnum.FARMER:
        user = await Farmer.findOne({ email });
        break;
      default:
        throw new BadRequest("Invalid role");
    }

    if (!user) {
      throw new BadRequest(`No ${role} found with email ${email}`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequest("Invalid password");
    }

    const token = generateJwtToken(user as IUser, role);

    res.cookie("token", token, CONFIG.COOKIE_SETTINGS as CookieOptions);

    res.json({ msg: "Logged in successfully", role:role });
  })
);

// add route
router.post(
  "/",
  validate(addUserValidator),
  dbUserCheckV2(true),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, role } = req.body as AddUser;
    let { password } = req.body as AddUser;
    let msg = "";

    password = await bcrypt.hash(password, config.SALT_ROUNDS);

    switch (role) {
      case RoleEnum.ADMIN:
        await Admin.create({ name, email, password });
        msg = "Admin created successfully";
        break;
      case RoleEnum.EXPERT:
        await Expert.create({ name, email, password });
        msg = "Expert created successfully";
        break;
      case RoleEnum.FARMER:
        await Farmer.create({ name, email, password });
        msg = "Farmer created successfully";
        break;
      default:
        throw new BadRequest("Invalid role");
    }

    res.json({ msg });
  })
);

// update route
router.put(
  "/:id",
  validate(idValidater),
  validate(editUserValidator),
  dbUserCheckV2(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as ParamsWithId;
    let { password, role } = req.body;

    if (password) {
      password = await bcrypt.hash(password, config.SALT_ROUNDS);
      req.body.password = password;
    }

    switch (role) {
      case RoleEnum.ADMIN:
        await Admin.findByIdAndUpdate(id, { ...req.body });
        break;
      case RoleEnum.EXPERT:
        await Expert.findByIdAndUpdate(id, { ...req.body });
        break;
      case RoleEnum.FARMER:
        await Farmer.findByIdAndUpdate(id, { ...req.body });
        break;
      default:
        throw new BadRequest("Invalid role");
    }

    res.json({ msg: "User updated successfully" });
  })
);

// delete route
router.delete(
  "/:id",
  validate(idValidater),
  validate(roleValidater),
  dbUserDelete(),
  asyncHandler(async (_: Request, res: Response) => {
    res.json({ msg: "User deleted successfully" });
  })
);

export default router;
