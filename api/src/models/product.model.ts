import { Document, Schema, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  price: number;
}

const procuctSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("product", procuctSchema);
