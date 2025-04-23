import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  text: string;
}

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = model<IMessage>("message", messageSchema);
