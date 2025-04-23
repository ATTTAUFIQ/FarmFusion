import jwt from "jsonwebtoken";
import config from "../config";
import multer from "multer";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";

import { NextFunction, Request, Response } from "express";
import { IUser } from "../models";
import { Role, TokenInfo } from "../types";
import path from "path";

export const generateJwtToken = (user: IUser | TokenInfo, role: Role) => {
  const dataToAdd = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
  } as TokenInfo;

  const token = jwt.sign(dataToAdd, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    issuer: config.JWT_ISSUER,
  });

  return token;
};

export const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
      cb(null, path.join(process.cwd(), "public", "uploads"));
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
      const fileType = file.originalname.split(".")[1];
      cb(null, `${uuid()}.${fileType}`);
    },
  }),
});

export const headerSetter = (_: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Powered-By", "Young Minds Technology Solutions Pvt Ltd");
  next();
};

/**
 * @description - nodemailer transporter
 * @returns - nothing
 * instance of nodemailer transporter
 */
const transpoter = nodemailer.createTransport(config.SMTP_URL, {});

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  content?: string,
  isHtml = false
) => {
  try {
    await transpoter.sendMail({
      from,
      to,
      subject,
      html: isHtml ? content : undefined,
      text: isHtml ? undefined : content,
    });
  } catch (error) {
    console.error(error, "failed to send mail");
  }
};
