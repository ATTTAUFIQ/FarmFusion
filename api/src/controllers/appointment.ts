import asyncHandler from "../middlewares/AsyncHandler";
import { Request, Response } from "express";
import { Router } from "express";
import { dbCheck, validate } from "../middlewares/Validator";
import {
  idValidater,
  addAppointmentValidator,
  editAppointmentValidator,
} from "../validators";
import { Appointment, IAppointment } from "../models";
import { AppointmentStatus, RoleEnum } from "../types";
import { BadRequest, NotFound } from "../customErrors";
import { ObjectId } from "mongodb";

const router = Router();

type AddAppoitment = IAppointment & {};

type ParamsWithId = {
  id: string;
};

type AppointmentFilter = {
  fromDate?: string;
  toDate?: string;
  meetLink?: string;
  expertId?: string;
  farmerId?: string;
  status?: AppointmentStatus;
  limit: string;
  page: string;
};

// get / filter
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      limit,
      page,
      expertId,
      farmerId,
      meetLink,
      fromDate,
      toDate,
      status,
    } = req.query as AppointmentFilter;

    let toQuery = {};

    if (expertId) {
      toQuery = {
        ...toQuery,
        expertId: new ObjectId(expertId),
      };
    }

    if (farmerId) {
      toQuery = {
        ...toQuery,
        farmerId: new ObjectId(farmerId),
      };
    }

    if (meetLink) {
      toQuery = { ...toQuery, meetLink };
    }

    if (status) {
      toQuery = { ...toQuery, status };
    }

    if (fromDate && toDate) {
      toQuery = {
        ...toQuery,
        whenDate: { $gte: new Date(fromDate), $lt: new Date(toDate) },
      };
    } else if (fromDate) {
      toQuery = { ...toQuery, whenDate: { $gte: new Date(fromDate) } };
    } else if (toDate) {
      toQuery = { ...toQuery, whenDate: { $lt: new Date(toDate) } };
    }

    const appointmentCount = await Appointment.countDocuments(toQuery);

    const appointments = await Appointment.aggregate([
      { $match: toQuery },
      { $sort: { whenDate: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          farmerId: 1,
          expertId: 1,
          whenDate: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M",
              date: "$whenDate",
            },
          },
          meetLink: 1,
          status: 1,
        },
      },
    ]);

    res.json({
      data: appointments,
      hasNext: parseInt(limit) * parseInt(page) < appointmentCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);
router.get(
  "/all",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      limit,
      page,
      meetLink,
      fromDate,
      toDate,
      status,
    } = req.query as AppointmentFilter;

    let toQuery = {};

    if (meetLink) {
      toQuery = { ...toQuery, meetLink };
    }

    if (status) {
      toQuery = { ...toQuery, status };
    }

    if (fromDate && toDate) {
      toQuery = {
        ...toQuery,
        whenDate: { $gte: new Date(fromDate), $lt: new Date(toDate) },
      };
    } else if (fromDate) {
      toQuery = { ...toQuery, whenDate: { $gte: new Date(fromDate) } };
    } else if (toDate) {
      toQuery = { ...toQuery, whenDate: { $lt: new Date(toDate) } };
    }

    const appointmentCount = await Appointment.countDocuments(toQuery);

    const appointments = await Appointment.aggregate([
      { $match: toQuery },
      { $sort: { whenDate: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "farmers", // The collection name for farmers
          localField: "farmerId", // Field from appointments to match
          foreignField: "_id", // Field in farmers collection
          as: "farmer", // The result will be stored in "farmer" field
        },
      },
      {
        $lookup: {
          from: "experts", // The collection name for experts
          localField: "expertId", // Field from appointments to match
          foreignField: "_id", // Field in experts collection
          as: "expert", // The result will be stored in "expert" field
        },
      },
      {
        $unwind: "$farmer", // Unwind to get individual farmer data
      },
      {
        $unwind: "$expert", // Unwind to get individual expert data
      },
      {
        $project: {
          _id: 1,
          farmer: 1, // Include entire farmer data
          expert: 1, // Include entire expert data
          whenDate: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M",
              date: "$whenDate",
            },
          },
          meetLink: 1,
          status: 1,
        },
      },
    ]);

    res.json({
      data: appointments,
      hasNext: parseInt(limit) * parseInt(page) < appointmentCount,
      hasPrev: parseInt(page) > 1,
    });
  })
);

// add route
router.post(
  "/",
  validate(addAppointmentValidator),
  asyncHandler(async (req: Request, res: Response) => {
    const { farmerId, expertId, whenDate, meetLink } =
      req.body as AddAppoitment;
    const { _id: currentUserId } = req.user;

    if (farmerId === expertId) {
      throw new BadRequest("You can't book appointment with yourself");
    }

    if (currentUserId !== farmerId) {
      throw new BadRequest("You can only book appointment for yourself");
    }

    await Appointment.create({
      farmerId,
      expertId,
      whenDate,
      meetLink,
    });

    res.json({ msg: "Appointment booked successfully" });
  })
);

// update route
router.put(
  "/:id",
  validate(idValidater),
  validate(editAppointmentValidator),
  dbCheck(Appointment),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as ParamsWithId;

    const { farmerId, expertId } = req.prevObject as IAppointment;
    const { status: newStatus, whenDate: newWhenDate, meetLink, } =
      req.body as IAppointment;

    const { _id: currentUserId, role } = req.user;

    if (newWhenDate) {
      // check if the updating existing farmerId == currentUserId
      if (farmerId.toString() !== currentUserId.toString()) {
        throw new BadRequest("You can only update your own appointment");
      }
    }

    if (newStatus !== AppointmentStatus.PENDING) {
      // check if the updating existing expertId == currentUserId
      if (expertId.toString() !== currentUserId.toString()) {
        if (role === RoleEnum.EXPERT) {
          throw new BadRequest(
            "You can only accept your own appointment and not others"
          );
        } else if (role === RoleEnum.FARMER) {
          throw new BadRequest(
            "You cannot change the status of an appointment , wait for expert to accept"
          );
        }
      }
    }

    await Appointment.findByIdAndUpdate(id, { ...req.body });
    res.json({ msg: "Appointment updated successfully" });
  })
);

// delete route
router.delete(
  "/:id",
  validate(idValidater),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as ParamsWithId;
    const { _id: currentUserId, role } = req.user;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new NotFound(`Appointment with id ${id} not found`);
    }

    if (appointment.status === AppointmentStatus.ACCEPTED) {
      throw new BadRequest(
        "Appointment can only be deleted if it is not accepted"
      );
    }

    if (role === RoleEnum.EXPERT) {
      if (appointment.expertId.toString() !== currentUserId.toString()) {
        throw new BadRequest("You can only delete your own appointment");
      }
    } else if (role === RoleEnum.FARMER) {
      if (appointment.farmerId.toString() !== currentUserId.toString()) {
        throw new BadRequest("You can only delete your own appointment");
      }
    }

    await appointment.deleteOne();

    res.json({ msg: "Appointment deleted successfully" });
  })
);

export default router;
