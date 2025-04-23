import { Schema, model } from "mongoose";
import { IUser, IUserShema } from "./base.model";

export interface IAdmin extends IUser {}

const adminSchema = new Schema(IUserShema, { timestamps: true });

export const Admin = model<IAdmin>("admin", adminSchema);
