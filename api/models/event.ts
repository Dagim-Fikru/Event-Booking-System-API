import mongoose, { Document, Schema } from 'mongoose';

interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IEvent extends Document, ITimestamps {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
}

const eventSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model < IEvent > ('Event', eventSchema);
