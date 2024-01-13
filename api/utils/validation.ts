import Joi from "joi";
import {IUser} from "../models/user";
import {IEvent} from "../models/event";
import {IBooking} from "../models/booking";

export const LoginValidation = (login: {email: string, password: string}) => {
    const loginSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return loginSchema.validate(login);
};

export const RegisterValidation = (user: IUser) => {
    const registerSchema = Joi.object<IUser>({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
        
    });

    return registerSchema.validate(user);
};

export const UpdateValidation = (user: IUser) => {
    const updateSchema = Joi.object<IUser>({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
        
    });

    return updateSchema.validate(user);
}

export const EventValidation = (event: IEvent) => {
    const eventSchema = Joi.object<IEvent>({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(6),
        date: Joi.string().min(6).required(),
        location: Joi.string().min(3).required(),
        capacity: Joi.number().required()
    });

    return eventSchema.validate(event);
};

export const BookingValidation = (booking: IBooking) => {
    const bookingSchema = Joi.object<IBooking>({
        event: Joi.string().min(3).required(),
        booking_date: Joi.string().min(6).required(),
        status: Joi.string().min(3).required()
    });

    return bookingSchema.validate(booking);
}