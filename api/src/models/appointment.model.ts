import { Document, Schema, model } from "mongoose";
import { AppointmentStatus } from "../types";

export interface IAppointment extends Document {
  farmerId: Schema.Types.ObjectId;
  expertId: Schema.Types.ObjectId;
  whenDate: Date;
  status: AppointmentStatus;
  meetLink?: string;
}

const appointmentSchema = new Schema(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: "expert",
    },
    whenDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    meetLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Appointment = model<IAppointment>(
  "appointment",
  appointmentSchema
);
