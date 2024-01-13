import express from "express";
import mongoose from "mongoose";
import Event from "../models/event";
import checkAuth from "../middleware/check-auth";
import EventController from "../controllers/eventController";

const router = express.Router();
router.get('/', EventController.get_all_events);

router.post('/', checkAuth, EventController.post_an_event);

router.get('/:eventId', EventController.get_individual_event);


router.put('/:eventId', checkAuth, EventController.update_an_event
);

router.delete('/:eventId', checkAuth, EventController.delete_an_event);





export default router;