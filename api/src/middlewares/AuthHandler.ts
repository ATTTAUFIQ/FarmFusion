import { NextFunction, Request, Response } from "express";
import CONFIG from "../config";
import jwt from "jsonwebtoken";
import { CookieSetter } from "./CookieSetter";
import { _401, Unauthorized } from "../customErrors";
import { RoleEnum, TokenInfo } from "../types";
import { Admin, Expert, Farmer } from "../models";

const TO_IGNORE_URLS = ["/api/users/login", "/api/users/register",'/api/utils/'];

/**
 * @description Middleware to check if the user is authenticated or not by checking the token from the cookie
 * and setting the user in the req object for further use and checking if the user is active or not
 * and setting the user in the req object for further use and setting the token in the cookie
 */
export const memberAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // skip auth for login

  if (TO_IGNORE_URLS.includes(req.url)) {
    return next();
  }

  const token = req.cookies["token"];

  if (!token) {
    return res.status(_401).json({
      message: "No Token found",
    });
  }

  try {
    const user = jwt.verify(token, CONFIG.JWT_SECRET) as TokenInfo;

    if (!user) {
      return res.status(_401).json({
        message: "Invalid token",
      });
    }

    let result;

    switch (user.role) {
      case RoleEnum.ADMIN:
        result = await Admin.findById(user._id);
        break;
      case RoleEnum.EXPERT:
        result = await Expert.findById(user._id);
        break;
      case RoleEnum.FARMER:
        result = await Farmer.findById(user._id);
        break;
      default:
        result = null;
        break;
    }

    if (!result) {
      throw new Unauthorized("TokenExpiredError");
    }

    req.user = user;

    await CookieSetter(req, res, () => {});

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(_401)
        .json({ message: "please login again session expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(_401).send({ message: "token maniplation detected" });
    } else {
      return res.status(_401).send(error);
    }
  }
};
