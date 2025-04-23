import { Schema } from "mongoose";

export type Role = "ADMIN" | "EXPERT" | "FARMER";

export type TokenInfo = {
  _id: Schema.Types.ObjectId;
  email: string;
  name: string;
  role: Role;
};

export enum RoleEnum {
  ADMIN = "ADMIN",
  EXPERT = "EXPERT",
  FARMER = "FARMER",
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}
