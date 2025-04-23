import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { Model } from "mongoose";
import { RoleEnum } from "../types";
import { Admin, Expert, Farmer } from "../models";
import fs from "fs/promises";

export const validate = (validationChain: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(
        validationChain.map((validation) => validation.run(req))
      );
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
        return;
      }
      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }
      return res.status(400).json({
        msg: errors.array().map((err: any) => {
          return {
            path: err.path,
            msg: err.msg,
          };
        }),
      });
    } catch (error: any) {
      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbDelete = (model: typeof Model) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await model.findById(id);
      if (result) {
        req.prevObject = result;
        await result.deleteOne();
        next();
        return;
      }
      return res
        .status(404)
        .json({ msg: `${model.modelName} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbUserDelete = () => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      let result;

      switch (role) {
        case RoleEnum.ADMIN:
          result = await Admin.findById(id);
          break;
        case RoleEnum.EXPERT:
          result = await Expert.findById(id);
          break;
        case RoleEnum.FARMER:
          result = await Farmer.findById(id);
          break;
        default:
          result = null;
          break;
      }

      if (result) {
        req.prevObject = result;
        await result.deleteOne();
        next();
        return;
      }

      return res.status(404).json({ msg: `${role} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbCheck = (model: typeof Model) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await model.findById(id);

      if (result) {
        req.prevObject = result;
        next();
        return;
      }

      return res
        .status(404)
        .json({ msg: `${model.modelName} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbCheckBody = (model: typeof Model, keyToCheck: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = req.body[keyToCheck as keyof typeof req.body];

      const result = await model.findOne({ [keyToCheck]: key });

      if (!result) {
        next();
        return;
      }

      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }

      return res.status(404).json({
        msg: `${model.modelName} with ${keyToCheck} : ${key} already exists`,
      });
    } catch (error: any) {
      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbCheckBodyUpdate = (model: typeof Model, keyToCheck: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // this is for update
      const { id } = req.params;

      const key = req.body[keyToCheck as keyof typeof req.body];

      const result = await model.findOne({ [keyToCheck]: key });

      // we are checking if the result is the same as the id
      // if same we are allowing the update
      // else we are sending the error
      if (!result || result._id == id) {
        next();
        return;
      }

      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }

      return res.status(404).json({
        msg: `${model.modelName} with ${keyToCheck} : ${key} already exists`,
      });
    } catch (error: any) {
      if (req.file) {
        const stats = await fs.stat(req.file.path);
        if (stats.isFile()) {
          await fs.unlink(req.file.path);
        }
      }
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbUserCheck = (role: RoleEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      let result;

      switch (role) {
        case RoleEnum.ADMIN:
          result = await Admin.findById(id);
          break;
        case RoleEnum.EXPERT:
          result = await Expert.findById(id);
          break;
        case RoleEnum.FARMER:
          result = await Farmer.findById(id);
          break;
        default:
          break;
      }

      if (result) {
        next();
        return;
      }

      return res.status(404).json({ msg: `${role} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};

export const dbUserCheckV2 = (flip = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role, email } = req.body;

      let result;

      if (flip) {
        switch (role) {
          case RoleEnum.ADMIN:
            result = await Admin.findOne({ email });
            break;
          case RoleEnum.EXPERT:
            result = await Expert.findOne({ email });
            break;
          case RoleEnum.FARMER:
            result = await Farmer.findOne({ email });
            break;
          default:
        }
      } else {
        switch (role) {
          case RoleEnum.ADMIN:
            result = await Admin.findById(id);
            break;
          case RoleEnum.EXPERT:
            result = await Expert.findById(id);
            break;
          case RoleEnum.FARMER:
            result = await Farmer.findById(id);
            break;
          default:
        }
      }

      if (flip) {
        if (!result) {
          next();
          return;
        }
        return res
          .status(400)
          .json({ msg: `${role} with email : ${email} already exists` });
      }

      if (result) {
        next();
        return;
      }

      return res.status(404).json({ msg: `${role} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};
