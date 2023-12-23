const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Booking = require("../models/booking");

const Event = require("../models/event");

const checkAuth = require("../middleware/check-auth");

router.post("/" ,checkAuth,(req, res, next) => {
    Event.findById(req.body.event)
        .then((event) => {
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
            return booking
                .save()
                .then((result) => {
                    console.log(result);
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
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get("/",checkAuth, (req, res, next) => {
    Booking.find()
        .select("-__v")
        .populate("event", "_id title description date location capacity")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                bookings: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        event: doc.event,
                        booking_date: doc.booking_date,
                        status: doc.status,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        request: {
                            description: "Get booking by id",
                            type: "GET",
                            url: "http://localhost:3000/bookings/" + doc._id,
                        },
                    };
                }),
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:bookingId",checkAuth,(req, res, next) => {
    Booking.findById(req.params.bookingId)
        .select("-__v")
        .populate("event", "-__v")
        .exec()
        .then((booking) => {
            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found",
                });
            }
            res.status(200).json({
                booking: booking,
                // request: {
                //     type: "GET",
                //     url: "http://localhost:3000/bookings",
                // },
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.put("/:bookingId",checkAuth,(req, res, next) => {
    const id = req.params.bookingId;
    Booking.findById(id).exec().then(booking => {
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }
        Booking.updateOne({ _id: id }, { $set: { status: req.body.status, booking_date: req.body.booking_date, event: req.body.event } })
            .exec()
            .then((result) => {
                res.status(200).json({
                    message: "Booking updated!",
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/bookings/" + id,
                    },
                });
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.delete("/:bookingId",checkAuth,(req, res, next) => {
    Booking.findById(req.params.bookingId)
        .exec()
        .then((booking) => {
            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found",
                });
            } else {
                Booking.deleteOne({ _id: req.params.bookingId })
                    .exec()
                    .then((result) => {
                        res.status(200).json({
                            message: "Booking Cancelled!",
                            request: {
                                description: "you can create a new booking with this url:",
                                type: "POST",
                                url: "http://localhost:3000/bookings",
                                body: {
                                    eventId: "ID",
                                    booking_date: "Date",
                                    status: "String",
                                },
                            },
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });

});

module.exports = router;
