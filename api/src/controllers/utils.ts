import asyncHandler from "../middlewares/AsyncHandler";
import { Request, Response } from "express";
import { Router } from "express";
import { validate } from "../middlewares/Validator";
import { newsValidator, weatherValidator } from "../validators";
import { BadRequest } from "../customErrors";
import CONFIG from "../config";

const router = Router();

type LatLng = {
  lat: string;
  lon: string;
};

type NewsBody = {
  topic: string;
};

// get weather given the lattitude and longitude
router.get(
  "/weather",
  // validate(weatherValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { lat, lon } = req.query as LatLng;
    const searchParams = new URLSearchParams({
      lat,
      lon,
      appid: CONFIG.WEATHER_API_KEY,
    });

    const weatherRes = await fetch(
      CONFIG.WEATHER_API_URL + searchParams.toString()
    );

    if (!weatherRes.ok) {
      throw new BadRequest("Error in fetching weather data");
    }

    const data = await weatherRes.json();

    res.json(data);
  })
);

// get news about given topic
router.get(
  "/news",
  validate(newsValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { topic } = req.query as NewsBody;

    const searchParams = new URLSearchParams({
      q: topic,
      apiKey: CONFIG.NEWS_API_KEY,
    });

    const newsRes = await fetch(CONFIG.NEWS_API_URL + searchParams.toString());

    if (!newsRes.ok) {
      throw new BadRequest("Error in fetching news data");
    }

    const data = await newsRes.json();

    res.json(data);
  })
);

export default router;
