import express from "express";
import mongoose from "mongoose";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = await User.find({ email: req.body.email }).exec();
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email already exists"
            });
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
            res.status(201).json({
                message: "User created successfully!",
                createdUser: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    password: result.password,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/users/" + result._id,
                    },
                },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Required fields are missing"});
    }
});

router.post("/login", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{

        const user = await User.find({ email: req.body.email }).exec();
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
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
            return res.status(200).json({
                message: "Auth successful",
                token: token,
            });
        }
        res.status(401).json({
            message: "Auth failed",
        });



    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.get("/:userId", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = await User.findById(req.params.userId).select("-__v").exec();
        if (user) {
            res.status(200).json({
                user: user,
                request: {
                    type: "GET",
                    description: "you can get all users with this url:",
                    url: "http://localhost:3000/users/",
                },
            });
        } else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
});

router.put("/:userId", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.userId;
    const updateOps: any = req.body;
    try {
        const result = await User.updateOne(
            { _id: id },
            { $set: updateOps }
        ).exec();
        console.log(result);
        res.status(200).json({
            message: "User updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/users/" + id,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
});

router.delete("/:userId", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await User.deleteOne({ _id: req.params.userId }).exec();
        res.status(200).json({
            message: "User deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/users/signup",
                body: {
                    name: "String",
                    email: "String",
                    password: "String",
                },
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid Id" });
    }
});




export default router;