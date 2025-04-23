import asyncHandler from "../middlewares/AsyncHandler";
import { Request, Response } from "express";
import { Router } from "express";
import { validate } from "../middlewares/Validator";
import { addForumMessageValidator } from "../validators";
import { ObjectId } from "mongodb";
import { ForumMessage, IForumMesage } from "../models/forum.model";

const router = Router();

type AddForumMessage = IForumMesage & {};

type ForumMessageFilter = {
  fromDate?: string;
  toDate?: string;
  senderId?: string;
  limit: string;
  page: string;
};

// get / filter
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, page, senderId, fromDate, toDate } =
      req.query as ForumMessageFilter;

    const { _id: currentUserId } = req.user;

    let toQuery = {};

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

    const forumMessageCount = await ForumMessage.countDocuments(toQuery);

    const forumMessages = await ForumMessage.aggregate([
      { $match: toQuery },
      // { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          text: 1,
          senderDetail: 1,
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
      data: forumMessages,
      hasNext: parseInt(limit) * parseInt(page) < forumMessageCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// add route
router.post(
  "/",
  validate(addForumMessageValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body as AddForumMessage;
    const { _id: currentUserId, name, email } = req.user;

    await ForumMessage.create({
      senderId: currentUserId,
      senderDetail: { name, email },
      text,
    });

    res.json({ msg: "Message added to forum successfully" });
  })
);

export default router;
