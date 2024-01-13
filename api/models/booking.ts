import mongoose, { Document, Schema } from "mongoose";
interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IBooking extends Document, ITimestamps {
    _id: string;
    event: string;
    booking_date: string;
    status: string;
}

const bookingSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    booking_date: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IBooking>("Booking", bookingSchema);
