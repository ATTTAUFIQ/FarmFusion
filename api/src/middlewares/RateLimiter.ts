import { Request, Response, NextFunction } from "express";
import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";

export const headerSetter = (_: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Powered-By", "Young Minds Technology Solutions Pvt Ltd");
  next();
};

/**
 * @description Rate Limiting Middleware for Express
 * @param windowMs - Time window for rate limiting
 * @param limit - Number of requests allowed in the window
 * @param standardHeaders - draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
 * @param legacyHeaders - Disable the `X-RateLimit-*` headers
 * @param store - Redis, Memcached, etc. See below.
 * @returns Rate Limiting Middleware for Express
 */
export const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 50, // limit each IP to 10 requests per windowMs
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  handler: (_: Request, res: Response) => {
    return res.status(429).send({
      message: "Too many requests, please try again later.",
      type: "error",
      limiter: true,
    });
  },
});
