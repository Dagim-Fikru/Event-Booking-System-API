const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    booking_date: { type: String, required: true },
    status : { type: String, required: true},

}, { timestamps: true});

module.exports = mongoose.model("Booking", bookingSchema);