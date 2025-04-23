import { Schema, model } from "mongoose";
import { IUser, IUserShema } from "./base.model";

export interface IFarmer extends IUser {}

const farmerSchema = new Schema(IUserShema, { timestamps: true });

export const Farmer = model<IFarmer>("farmer", farmerSchema);
