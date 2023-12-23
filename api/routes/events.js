const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Event = require('../models/event');

const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    Event.find()
        .select("-__v")
        .exec()
        .then((docs) => {
            const response = {
                number_of_events: docs.length,
                events: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        description: doc.description,
                        date: doc.date,
                        location: doc.location,
                        capacity: doc.capacity,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        request: {
                            type: "GET",
                            description: "you can get the event by id with this url:",
                            url: "http://localhost:3000/events/" + doc._id,
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

router.post("/",checkAuth, (req, res, next) => {
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        capacity: req.body.capacity,
    });
    event
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Event created successfully!",
                createdEvent: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    date: result.date,
                    location: result.location,
                    capacity: result.capacity,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        description: 'Get the created event',
                        type: 'GET',
                        url: 'http://localhost:3000/events/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });


});

router.get('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    Event.findById(id).select('-__v')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    event: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all events',
                        url: 'http://localhost:3000/events'
                    }
                });
            } else {
                res.status(404).json({
                    message: "Not a valid Id",
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

router.put("/:eventId",checkAuth,(req, res, next) => {
    const id = req.params.eventId;
    Event.findById(id).exec().then(event => {
        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        } else{
            Event.updateOne({ _id: id }, { $set: { title: req.body.title, description: req.body.description, date: req.body.date, location: req.body.location, capacity: req.body.capacity } })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Event updated successfully!",
                        request: {
                            type: 'GET',
                            description: 'Get the updated event',
                            url: 'http://localhost:3000/events/' + id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
    

});

router.delete("/:eventId", checkAuth,(req, res, next) => {
    Event.findById(req.params.eventId).exec().then(event => {
        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        } else {
            Event.deleteOne({ _id: req.params.eventId })
                .exec()
                .then((result) => {
                    res.status(200).json({
                        message: "Event deleted!",
                        request: {
                            type: "POST",
                            description: "Create a new event",
                            url: "http://localhost:3000/events",
                            body: {
                                title: "String",
                                description: "String",
                                date: "String",
                                location: "String",
                                capacity: "Number",
                            },
                        },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });

});

module.exports = router;    