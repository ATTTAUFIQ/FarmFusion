import { Schema, model, Document } from "mongoose";

export interface IForumMesage extends Document {
  senderId: Schema.Types.ObjectId;
  text: string;
}

const forumMessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, required: true },
    senderDetail: {
      type: {},
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const ForumMessage = model<IForumMesage>(
  "forum-message",
  forumMessageSchema
);
