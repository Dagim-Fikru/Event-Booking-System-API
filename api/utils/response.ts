import { Response } from "express";
import { error_log } from "../models/log.entity";



// status code 200 represents success which means request has been successfully fetched
export const sendSuccess = (res: Response, message: string, data?: any) => {
    res.status(200).json({
        message,
        data,
    });
};

// Send token will send status code 200 representing success and transfers the logged in user token
export const sendToken = (res: Response, token: string) => {
    res.status(200).json({
        api_token: token
    });
};


// Forbidden to hide the existence of a resource from an unauthorized request
export const sendForbidden = (res: Response, message: string, data?: any) => {
    res.status(403).json({
        message,
        data,
    });
};


// 401 Unauthorized error would be returned is if a user tries to access a resource that is protected by authentication
export const sendUnauthorized = (res: Response, data?: any) => {
    res.status(401).json({
        message: "Resource Protected by Authentication",
        data,
    });
};


// The server is unable to locate the requested resource
export const sendNotFound = (res: Response, message: string, data?: any) => {
    res.status(404).json({
        message,
        data,
    });
};


// 500 (Internal Server Error) | meaning the the request is not fulfilled because the server encounters an unexpected condition
export const sendBadRequest = async (
    res: Response,
    message: string,
    data?: any
) => {
    try {
        let newlog = await error_log.create({
            level: "Error   500",
            message: message + " " + data,
            timestamp: new Date(), // Assuming you want to set the current date and time
        });

        await newlog.save();

        res.status(500).json({
            message,
            data,
        });
    } catch (err) {
        // Handle the error appropriately, e.g., log it and send a generic error response
        console.error("Failed to create error log:", err);
        res.status(500).json({
            message: "Internal Server Error",
            data: null,
        });
    }
};

