import mongoose, { Document, Schema } from "mongoose";

interface ILog extends Document {
    level: string;
    message: string;
    timestamp: Date;
}

const logSchema: Schema = new Schema({
    level: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const error_log = mongoose.model<ILog>("ErrorLog", logSchema);
