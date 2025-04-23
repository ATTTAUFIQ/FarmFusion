import asyncHandler from "../middlewares/AsyncHandler";
import { Request, Response } from "express";
import { Router } from "express";
import { validate } from "../middlewares/Validator";
import { addMessageValidator } from "../validators";
import { IMessage, Message } from "../models";
import { BadRequest } from "../customErrors";
import { ObjectId } from "mongodb";

const router = Router();

type AddMessage = IMessage & {};

type MessageFilter = {
  fromDate?: string;
  toDate?: string;
  senderId?: string;
  recieverId?: string;
  limit: string;
  page: string;
};

// get / filter
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, page, recieverId, senderId, fromDate, toDate } =
      req.query as MessageFilter;

    const { _id: currentUserId } = req.user;

    let toQuery = {};

    if (recieverId) {
      toQuery = { ...toQuery, recieverId: new ObjectId(recieverId) };
    }

    if (senderId) {
      toQuery = { ...toQuery, senderId: new ObjectId(senderId) };
    }

    if (fromDate && toDate) {
      toQuery = {
        ...toQuery,
        createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
      };
    } else if (fromDate) {
      toQuery = { ...toQuery, createdAt: { $gte: new Date(fromDate) } };
    } else if (toDate) {
      toQuery = { ...toQuery, createdAt: { $lt: new Date(toDate) } };
    }

    const messageCount = await Message.countDocuments(toQuery);

    const messages = await Message.aggregate([
      { $match: toQuery },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          text: 1,
          when: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M:%S",
              date: "$createdAt",
            },
          },
        },
      },
    ]);

    res.json({
      data: messages,
      hasNext: parseInt(limit) * parseInt(page) < messageCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// add route
router.post(
  "/",
  validate(addMessageValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { receiverId, text } = req.body as AddMessage;
    const { _id: currentUserId } = req.user;

    if (currentUserId.toString() === receiverId.toString()) {
      throw new BadRequest("You can't send message to yourself");
    }

    await Message.create({ senderId: currentUserId, receiverId, text });

    //TODO: use socket.io to emit message to receiver in a room or else use push notification

    res.json({ msg: "Message sent successfully" });
  })
);

export default router;
