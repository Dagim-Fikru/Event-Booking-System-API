import express from "express";
import Booking from "../models/booking";
import mongoose from "mongoose";
import Event from "../models/event";
import { BookingValidation } from "../utils/validation";

const BookingController = {
    post_abooking: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { error } = BookingValidation(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const event = await Event.findById(req.body.event);
            if (!event) {
                return res.status(404).json({
                    message: "Event not found",
                });
            }
            const booking = new Booking({
                _id: new mongoose.Types.ObjectId(),
                event: req.body.event,
                booking_date: req.body.booking_date,
                status: req.body.status,
            });
            const result = await booking.save();
            res.status(201).json({
                message: "Event Booked successfully!",
                createdBooking: {
                    _id: result._id,
                    event: result.event,
                    booking_date: result.booking_date,
                    status: result.status,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/bookings/" + result._id,
                    },
                },
            });
        } catch (err) {
            res
                .status(500)
                .json({ error: "invalid event id" });
        }
    },
    get_all_bookings: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const bookings = await Booking.find()
                .select("_id event booking_date status createdAt updatedAt")
                .populate("event", "_id title description price date")
                .exec();
            res.status(200).json({
                count: bookings.length,
                bookings: bookings.map((booking) => {
                    return {
                        _id: booking._id,
                        event: booking.event,
                        booking_date: booking.booking_date,
                        status: booking.status,
                        createdAt: booking.createdAt,
                        updatedAt: booking.updatedAt,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/bookings/" + booking._id,
                        },
                    };
                }),
            });
        } catch (err) {
            res.status(500).json({ error: "Error occurred while fetching bookings" });
        }
    },

    get_individual_booking: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const booking = await Booking.findById(req.params.bookingId)
                .select("_id event booking_date status createdAt updatedAt")
                .populate("event", "_id title description price date")
                .exec();
            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found",
                });
            }
            res.status(200).json({
                booking: booking,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/bookings",
                },
            });
        } catch (err) {
            res.status(500).json({ error: "Invalid Id" });
        }
    },

    updating_abooking: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        let booking;
        try {
            booking = await Booking.findById(req.params.bookingId).exec();
        } catch (err) {
            return res.status(400).json({ error: "Invalid Id" });
        }
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const id = req.params.bookingId;
        const updateOps: any = req.body;
        try {
            const result = await Booking.updateOne(
                { _id: id },
                { $set: updateOps }
            ).exec();
            console.log(result);
            res.status(200).json({
                message: "Booking updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/bookings/" + id,
                },
            });
        } catch (err) {
            res.status(500).json({ error: "Invalid Id" });
        }
    },

    delete_a_booking: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const booking = await Booking.findById(req.params.bookingId).exec();
            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found",
                });
            }
            await Booking.deleteOne({ _id: req.params.bookingId }).exec();
            res.status(200).json({
                message: "Booking deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/bookings",
                    body: {
                        eventId: "ID",
                        booking_date: "Date",
                        status: "String",
                    },
                },
            });
        } catch (err) {
            res.status(500).json({ error: "Invalid Id" });
        }
    },
};

export default BookingController;
