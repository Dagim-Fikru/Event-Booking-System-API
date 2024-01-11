import mongoose, { Document, Schema } from 'mongoose';

interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

interface IUser extends Document, ITimestamps {
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
        validate: {
            validator: function (v: string): boolean {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: (props: any): string => `${props.value} is not a valid email address!`,
        },
        unique: true,
    },
    password: { type: String, required: true, minLength: 6 },
}, { timestamps: true });

export default mongoose.model < IUser > ('User', userSchema);
