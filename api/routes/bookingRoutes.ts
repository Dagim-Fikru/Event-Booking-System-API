import express from "express";
import checkAuth from "../middleware/check-auth";
import BookingController from "../controllers/bookingController";

const router = express.Router();

router.post(
    "/",
    checkAuth,
    BookingController.post_abooking
);

router.get(
    "/", checkAuth,
    BookingController.get_all_bookings
);

router.get(
    "/:bookingId",
    checkAuth,
    BookingController.get_individual_booking
);

router.put("/:bookingId", 
checkAuth, 
BookingController.updating_abooking);

router.delete(
    "/:bookingId",
    checkAuth,
    BookingController.delete_a_booking
);


export default router;
