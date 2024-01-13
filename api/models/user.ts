import mongoose, { Document, Schema } from 'mongoose';

interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends Document, ITimestamps {
    _id: string;
    name: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model < IUser > ('User', userSchema);
