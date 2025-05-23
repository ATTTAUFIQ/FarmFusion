/**
 * ?This is the entry point of the application
 * @author YMTS <devteam@ymtsindia.in>
 * @version 1.0
 */

import express from "express";
import cors from "cors";
import compression from "compression";
import config from "./config";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { TokenInfo } from "./types";
import cookieParser from "cookie-parser";
import {
  FOLDER_PATH,
  blueText,
  greenText,
  redLogger,
  redText,
} from "./constants";
import { limiter } from "./middlewares/RateLimiter";
import { memberAuthHandler } from "./middlewares/AuthHandler";
import ErrorHandler from "./middlewares/ErrorHandler";
import mongoose from "mongoose";
import CONFIG from "./config";
import { paginationChecker } from "./middlewares/PaginationChecker";
import { Admin } from "./models";
import { hash } from "bcrypt";
import Razorpay from "razorpay";

const publicFolderPath = path.join(process.cwd(), FOLDER_PATH.PUBLIC);
const uploadFolderPath = path.join(publicFolderPath, FOLDER_PATH.UPLOADS);

console.log(blueText, "🚀 Application Starting...", blueText);
// 📁 Public Folder Creation
if (!fs.existsSync(publicFolderPath)) {
  fs.mkdirSync(publicFolderPath);
  console.log(blueText, "📁 Public Folder Created", blueText);
} else {
  console.log(blueText, "📁 Public Folder Exists", blueText);
}

if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath);
  console.log(blueText, "📁 Uploads Folder Created", blueText);
} else {
  console.log(blueText, "📁 Uploads Folder Exists", blueText);
}

const corsConfig = {
  credentials: true,
  origin: ["http://localhost:5173","http://localhost:5173/","http://localhost", "http://localhost:80","http://localhost:5173","http://localhost:5173/"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

//! 🚀 Create an instance of express
const app = express();

app.use(morgan("dev")); //! 📝 Log HTTP or HTTPS requests

app.use(cors(corsConfig)); //! 📝 Enable Cross-Origin Resource Sharing (CORS)

app.use(limiter); //! 📝 Rate Limiting Middleware for Express

app.use(express.json()); //! 📝 Parse JSON bodies

app.use(cookieParser()); //! 📝 Parse Cookie headers

app.use(compression()); //! 📝 Compress HTTP or HTTPS responses

app.use("/static", express.static(publicFolderPath)); //! 📝 Serve Static Files

/**
 * ? 🌐 Global Declaration
 */
declare global {
  namespace Express {
    interface Request {
      user: TokenInfo;
      permissions: string[];
      prevObject: any;
    }
  }
}

// 🔄 Immediately Invoked Function Expression (IIFE) for async initialization
(async () => {
  try {
    // 📦 Database Initialization
    console.log(blueText, "📦  Database Initialization Started", blueText);
    // connecting to database
    await mongoose.connect(CONFIG.DB_URL, {
      maxPoolSize: CONFIG.DB_POOL_SIZE,
    });
    const admin = await Admin.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      await Admin.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: await hash("admin@123", CONFIG.SALT_ROUNDS),
      });
      console.log(greenText, "📦  Admin User Created", greenText);
    }
    console.log(greenText, "📦  Database Initialization Completed", greenText);
    console.log(greenText, `📦  Connected To ${config.DB_URL} `, greenText);
    // 🌐 Server Initialization
    console.log(
      blueText,
      ` Starting the server on port ${config.PORT}...`,
      blueText
    );
    try {
      app.listen(config.PORT, () => {
        console.log(
          greenText,
          `🎧 Server is listening on port: ${config.PORT} 🚀`,
          greenText
        );
      });
    } catch (error) {
      console.log(
        redText,
        "🚨 Error in server initialization \n",
        JSON.stringify(error).replace(/,|{|}|and/g, "\n"),
        redText
      );
    }
  } catch (error) {
    // console.log("🚨 Error in server initialization", error);
    console.log(
      redText,
      "🚨 Error in server initialization \n",
      JSON.stringify(error).replace(/,|{|}|and/g, "\n"),
      redText
    );
    // 🛑 restart by executing rs in cmd
    redLogger("🛑 Application Stopped due to error in server initialization");
    process.exit(1);
  }
})();

/**
 * ! This is the Health check of the application
 */
app.get("/", (_, res) => {
  res.json({
    status: "OK",
    health: "✅ Good",
    message: `Welcome to the API of ${config.APP_NAME}`,
  });
});

// Endpoint to create an order
app.post("/create-order", (req, res) => {
  const { amount } = req.body; // amount in INR (but multiplied by 100 to convert to paise)

  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
    currency: "INR", // Currency to be used for payment
    receipt: `receipt_${new Date().getTime()}`, // A unique receipt number for your records
  };

  instance.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create order" });
    }
    res.json({ orderId: order.id }); // Send the order ID to the frontend
  });
});



app.use(paginationChecker); //! 🚨 Pagniation Middleware
// app.use(memberAuthHandler); //! 🚨 Auth Middleware

app.use("/api/users", require("./controllers/user").default);
app.use("/api/products", require("./controllers/product").default);
app.use("/api/govt-schemes", require("./controllers/govt-scheme").default);
app.use("/api/appointments", require("./controllers/appointment").default);
app.use("/api/messages", require("./controllers/message").default);
app.use("/api/forum-messages", require("./controllers/forum").default);
app.use("/api/utils", require("./controllers/utils").default);

app.get("*", (_, res) => {
  res.status(404).json({
    status: "Not Found",
    health: "❌ Bad",
    message: `Route Not Found`,
  });
});



// Setup Razorpay instance with your key and secret
const instance = new Razorpay({
  key_id: "rzp_test_ZglqkhKmjt7KLv", // Your test key id
  key_secret: "koCftQdZoRmk8vfSblyXhngu", // Your test key secret
});

//! 🚨 Error Middleware came here and the response is given back
app.use(ErrorHandler);
