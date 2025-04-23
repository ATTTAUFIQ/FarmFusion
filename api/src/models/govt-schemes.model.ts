import { Schema, model, Document, Types } from "mongoose";

export interface IGovtScheme extends Document {
  name: string;
  description: string;
  link: string;
}

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

export const GovtScheme = model<IGovtScheme>("govt-scheme", messageSchema);
