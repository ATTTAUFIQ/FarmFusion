/**
 * @fileoverview This file contains the configuration for the application.
 * @author YMTS <devteam@ymtsindia.in>
 */
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration for the application
 */
const CONFIG = {
  // Application Configuration
  APP_NAME: "Farm Fusion",
  HOST: process.env.HOST || "http://localhost:8000",
  PORT: process.env.PORT || 8000,
  PRODUCTION: process.env.NODE_ENV === "production",
  CLIENT_URL: process.env.CLIENT_URL || "https://boilerplate.com",

  // Database Configuration
  DATABASE_SEEDING: process.env.DATABASE_SEEDING === "true",
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/farm-fusion",
  DB_POOL_SIZE: 10,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_ISSUER: process.env.JWT_ISSUER || "boilerplate",

  // Password Configuration
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10, // the more the salt rounds the more the time it takes to hash the password

  // Mail Configuration
  SMTP_URL:
    process.env.SMTP_URL ||
    "smtps://no-reply@ymtsindia.com:Takeoff@123@mail.ymtsindia.com:465/?pool=true",

  // Cookie Configuration
  COOKIE_SETTINGS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 10, // 10 minute
  },

  // Weather API Configuration
  WEATHER_API_URL:
    process.env.WEATHER_API_URL ||
    "https://api.openweathermap.org/data/2.5/forecast?",
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || "780f70545f39e7059581d72f0683a869",

  // News API Configuration
  NEWS_API_URL:
    process.env.NEWS_API_URL || "https://newsapi.org/v2/everything?",
  NEWS_API_KEY: process.env.NEWS_API_KEY || "38a7b63d5aa84c4880e66a876bdb5b5d",
};
export default CONFIG;
