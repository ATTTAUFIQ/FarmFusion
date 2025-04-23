import { param, body, query } from "express-validator";
import { RoleEnum as ROLES } from "../types";
import { Expert, Farmer } from "../models";
import { AppointmentStatus } from "../types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone); // Extend dayjs with timezone plugin
// set dayjs to IST timezone
dayjs.tz.setDefault("Asia/Kolkata");

export const idValidater = [
  param("id").isMongoId().withMessage("Id must be a valid mongo id"),
];

export const roleValidater = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const roleParamsValidater = [
  query("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const roleWithQParamsValidater = [
  query("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),

  query("q").optional().isString().withMessage("Query must be a string"),
];

export const addUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const editUserValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Email must be a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const loginValidator = [
  body("email").optional().isEmail().withMessage("Email must be a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const addProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("image")
    .optional()
    .custom((value) => {
      const image = value as Express.Multer.File;
      if (!image) {
        throw new Error("Image is required");
      }
      if (!image.mimetype.startsWith("image")) {
        throw new Error("File must be an image");
      }
      return true;
    })
    .withMessage("Image is required"),
];

export const editProductValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("image")
    .optional()
    .custom((value) => {
      const image = value as Express.Multer.File;
      if (!image) {
        throw new Error("Image is required");
      }
      if (!image.mimetype.startsWith("image")) {
        throw new Error("File must be an image");
      }
      return true;
    })
    .withMessage("Image is required"),
];

export const addGovtSchemeValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("link")
    .notEmpty()
    .withMessage("Description is required")
    .isURL()
    .withMessage("Link must be a valid URL"),
];

export const editGovtSchemeValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("link").optional().isURL().withMessage("Link must be a valid URL"),
];

export const addAppointmentValidator = [
  body("farmerId")
    .notEmpty()
    .withMessage("FarmerId is required")
    .isMongoId()
    .withMessage("FarmerId must be a valid mongo id")
    .custom((value) => {
      const farmerId = value as string;
      // check if farmer exists
      const farmer = Farmer.findById(farmerId);
      if (!farmer) {
        throw new Error("Farmer not found");
      }
      return true;
    })
    .withMessage("Farmer not found"),
  body("expertId")
    .notEmpty()
    .withMessage("ExpertId is required")
    .isMongoId()
    .withMessage("ExpertId must be a valid mongo id")
    .custom((value) => {
      const expertId = value as string;
      // check if expert exists
      const expert = Expert.findById(expertId);
      if (!expert) {
        throw new Error("Expert not found");
      }
      return true;
    }),
  body("whenDate")
    .notEmpty()
    .withMessage("WhenDate is required")
    .isDate()
    .withMessage("WhenDate must be a valid date")
    .custom((value) => {
      const whenDate = value as Date;
      if (whenDate < new Date()) {
        throw new Error("WhenDate must be a future date");
      }
      return true;
    }),
  body("meetLink")
    .optional()
    .isURL()
    .withMessage("MeetLink must be a valid URL")
    .custom((value) => {
      const meetLink = value as string;
      if (!meetLink.startsWith("meet.google.com")) {
        throw new Error("MeetLink must be a google meet link");
      }
      return true;
    })
    .withMessage("MeetLink must be a google meet link"),
];

export const editAppointmentValidator = [
  body("whenDate")
    .optional()
    .isDate()
    .withMessage("WhenDate must be a valid date")
    .custom((value) => {
      const whenDate = value as Date;
      if (whenDate < new Date()) {
        throw new Error("WhenDate must be a future date");
      }
      return true;
    }),
  body("meetLink")
    .optional()
    .isURL()
    .withMessage("MeetLink must be a valid URL")
    .custom((value) => {
      const meetLink = value as string;
      if (!meetLink.startsWith("meet.google.com")) {
        throw new Error("MeetLink must be a google meet link");
      }
      return true;
    })
    .withMessage("MeetLink must be a google meet link"),
  body("status")
    .optional()
    .isIn(Object.values(AppointmentStatus))
    .withMessage(
      "Status must be in " + Object.values(AppointmentStatus).join(", ")
    ),
];

export const addMessageValidator = [
  body("receiverId")
    .notEmpty()
    .withMessage("Reciever is required")
    .isMongoId()
    .withMessage("Reciever must be a valid mongo id"),
  body("text")
    .notEmpty()
    .withMessage("ExpertId is required")
    .isString()
    .withMessage("ExpertId must be a string"),
];

export const addForumMessageValidator = [
  body("text")
    .notEmpty()
    .withMessage("ExpertId is required")
    .isString()
    .withMessage("ExpertId must be a string"),
];

export const weatherValidator = [
  query("lat")
    .notEmpty()
    .withMessage("Latitude is required")
    .isNumeric()
    .withMessage("Latitude must be a number"),
  query("lng")
    .notEmpty()
    .withMessage("Longitude is required")
    .isNumeric()
    .withMessage("Longitude must be a number"),
];

export const newsValidator = [
  query("topic")
    .notEmpty()
    .withMessage("Topic is required")
    .isString()
    .withMessage("Topic must be a string"),
];
