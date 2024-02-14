import express from "express";
import mongoose from "mongoose";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterValidation } from "../utils/validation";
import { LoginValidation } from "../utils/validation";
import { UpdateValidation } from "../utils/validation";
import { sendBadRequest, sendSuccess, sendNotFound, sendUnauthorized } from "../utils/response";
const UserController = {
    user_signup: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { error } = RegisterValidation(req.body);
            if (error) {
                // return res.status(400).json({ error: error.details[0].message });
                return sendBadRequest(res, error.details[0].message);
            }
            const user = await User.find({ email: req.body.email }).exec();
            if (user.length >= 1) {
                return sendBadRequest(res, "Email already exists");
                // return res.status(409).json({
                //     message: "Email already exists",
                // });
            } else {
                const hash = await bcrypt.hash(req.body.password, 10);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                });
                const result = await user.save();
                console.log(result);
                sendSuccess(res, "User created successfully!", result);
                // res.status(201).json({
                //     message: "User created successfully!",
                //     createdUser: {
                //         _id: result._id,
                //         name: result.name,
                //         email: result.email,
                //         password: result.password,
                //         createdAt: result.createdAt,
                //         updatedAt: result.updatedAt,
                //         request: {
                //             type: "GET",
                //             url: "http://localhost:3000/users/" + result._id,
                //         },
                //     },
                // });
            }
        } catch (err) {
            console.log(err);
            // res.status(500).json({ error: "Required fields are missing" });
            sendBadRequest(res, "Required fields are missing");
        }
    },
    user_login: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { error } = LoginValidation(req.body);
            if (error) {
                // return res.status(400).json({ error: "Email or password is incorrect" });
                return sendBadRequest(res, "Email or password is incorrect");
            }
            const user = await User.find({ email: req.body.email }).exec();
            if (user.length < 1) {
                return sendNotFound(res, "User not found");
                // return res.status(401).json({
                //     message: "User not found",
                // });
            }
            const result = await bcrypt.compare(req.body.password, user[0].password);
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id,
                    },
                    process.env.JWT_KEY as string,
                    {
                        expiresIn: "12h",
                    }
                );
                return sendSuccess(res, "Auth successful", { token: token });
                // return res.status(200).json({
                //     message: "Auth successful",
                //     token: token,
                // });
            }
            sendUnauthorized(res, "Auth failed");
            // res.status(401).json({
            //     message: "Auth failed",
            // });
        } catch (err) {
            // res.status(500).json({ error: err });
            sendBadRequest(res, "Required fields are missing");
        }
    },
    get_all_users: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const docs = await User.find().select("-__v").exec();
            const response = {
                number_of_users: docs.length,
                users: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        email: doc.email,
                        password: doc.password,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        request: {
                            type: "GET",
                            description: "you can get the user by id with this url:",
                            url: "http://localhost:3000/users/" + doc._id,
                        },
                    };
                }),
            };
            // res.status(200).json(response);
            sendSuccess(res, "All users", response);
        } catch (err) {
            sendBadRequest(res, "Error occurred while fetching users", err);
            // console.log(err);
            // res.status(500).json({ error: err });
        }
    },

    get_individual_user: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const user = await User.findById(req.params.userId).select("-__v").exec();
            if (user) {
                sendSuccess(res, "User details", user);
                // res.status(200).json({
                //     user: user,
                //     request: {
                //         type: "GET",
                //         description: "you can get all users with this url:",
                //         url: "http://localhost:3000/users/",
                //     },
                // });
            } else {
                sendNotFound(res, "No valid entry found for provided ID");
                // res
                //     .status(404)
                //     .json({ message: "No valid entry found for provided ID" });
            }
        } catch (err) {
            sendBadRequest(res, "Invalid Id", err);
            // console.log(err);
            // res.status(500).json({ error: "Invalid Id" });
        }
    },

    update_user: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {

        try {
            const { error } = UpdateValidation(req.body);
            if (error) {
                // return res.status(400).json({ error: error.details[0].message });
                return sendBadRequest(res, error.details[0].message);
            }
            const user = await User.findById(req.params.userId).exec();
            if (!user) {
                return sendNotFound(res, "User not found");
                // return res.status(404).json({
                //     message: "User not found",
                // });
            }
            const id = req.params.userId;
            const updateOps: any = req.body;
            const result = await User.updateOne(
                { _id: id },
                { $set: updateOps }
            ).exec();
            console.log(result);
            sendSuccess(res, "User updated", result);
            // res.status(200).json({
            //     message: "User updated",
            //     request: {
            //         type: "GET",
            //         url: "http://localhost:3000/users/" + id,
            //     },
            // });
        } catch (err) {
            // res.status(500).json({ error: "Invalid Id" });
            sendBadRequest(res, "Invalid Id");
        }
    },

    delete_user: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const user = await User.findById(req.params.userId).exec();
            if (!user) {
                return sendNotFound(res, "User not found");
                // return res.status(404).json({
                //     message: "User not found",
                // });
            }
            const result = await User.deleteOne({ _id: req.params.userId }).exec();
            sendSuccess(res, "User deleted", result);
            // res.status(200).json({
            //     message: "User deleted",
            //     request: {
            //         type: "POST",
            //         url: "http://localhost:3000/users/signup",
            //         body: {
            //             name: "String",
            //             email: "String",
            //             password: "String",
            //         },
            //     },
            // });
        } catch (err) {
            // res.status(500).json({ error: "Invalid Id" });
            sendBadRequest(res, "Invalid Id");
        }
    },
};

export default UserController;