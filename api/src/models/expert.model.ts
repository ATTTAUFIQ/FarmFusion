import { Schema, model } from "mongoose";
import { IUser, IUserShema } from "./base.model";

export interface IExpert extends IUser {}

const expertSchema = new Schema(IUserShema, { timestamps: true });

export const Expert = model<IExpert>("expert", expertSchema);
