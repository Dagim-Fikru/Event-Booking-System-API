import express from "express";
import mongoose from "mongoose";
import Event from "../models/event";
import checkAuth from "../middleware/check-auth";

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const docs = await Event.find().select("-__v").exec();
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
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ error: "An error occurred while fetching events" });
    }
});

router.post('/', checkAuth, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        capacity: req.body.capacity,
    });
    try {
        const result = await event.save();
        console.log(result);
        res.status(201).json({
            message: "Event created successfully",
            createdEvent: {
                _id: result._id,
                title: result.title,
                description: result.description,
                date: result.date,
                location: result.location,
                capacity: result.capacity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/events/" + result._id,
                },
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Required fields can't be empty" });
    }
});

router.get('/:eventId', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const event = await Event.findById(req.params.eventId).select("-__v").exec();
        if (event) {
            res.status(200).json({
                event: event,
                request: {
                    type: "GET",
                    description: "you can get all events with this url:",
                    url: "http://localhost:3000/events/",
                },
            });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
});


router.put('/:eventId', checkAuth, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const event = await Event.findById(req.params.eventId).select("-__v").exec();
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    const id = req.params.eventId;
    const updateOps: any = req.body;
    try {
        const result = await Event.updateOne(
            { _id: id },
            { $set: updateOps }
        ).exec();
        console.log(result);
        res.status(200).json({
            message: "Event updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/events/" + id,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
}
);

router.delete('/:eventId', checkAuth, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const event = await Event.findById(req.params.eventId)
            .select("-__v")
            .exec();
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const result = await Event.deleteOne({ _id: req.params.eventId }).exec();
        res.status(200).json({
            message: "Event deleted",
            request: {
                type: "POST",
                message: "Create a new Event",
                url: "http://localhost:3000/events/",
                body: {
                    title: "String",
                    description: "String",
                    date: "Date",
                    location: "String",
                    capacity: "Number",
                },
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
});





export default router;