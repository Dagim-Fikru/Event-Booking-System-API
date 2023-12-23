const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                    });
                    user
                        .save()
                        .then((result) => {
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
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                }
            });

        }
    });
    // 10 is the salt value for hashing 
});

router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email }).exec().then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                // create a token
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1week"
                });
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth failed"
            });
        }); // compare the password
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


router.get("/", (req, res, next) => {
    User.find()
        .select("-__v")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
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
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:userId", (req, res, next) => {
    User.findById(req.params.userId)
        .select("-__v")
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            } else {
                res.status(200).json({
                    user: user
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.put("/:userId", (req, res, next) => {
    User.findById(req.params.userId).exec().then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        } else {
            // Check if the updated email already exists
            User.findOne({ email: req.body.email })
                .exec()
                .then(existingUser => {
                    if (existingUser && existingUser._id.toString() !== req.params.userId) {
                        return res.status(409).json({
                            message: "Email is already in use!"
                        });
                    }
                    // Validate the email
                    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    if (!emailRegex.test(req.body.email)) {
                        return res.status(400).json({
                            message: "Invalid email address!"
                        });
                    }
                    // If the email is valid and not already in use, proceed with the update
                    User.updateOne({ _id: req.params.userId }, {
                        $set: {
                            name: req.body.name,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password, 10, (err, hash) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: err,
                                    });
                                } else {
                                    return hash;
                                }
                            })
                        }
                    })
                        .exec()
                        .then((result) => {
                            res.status(200).json({
                                message: "User updated successfully!",
                                request: {
                                    type: "GET",
                                    description: "You can get the updated user with this url:",
                                    url: "http://localhost:3000/users/" + req.params.userId,
                                },
                            });
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete("/:userId", (req, res, next) => {
    User.findById(req.params.userId).exec().then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        } else {
            User.deleteOne({ _id: req.params.userId })
                .exec()
                .then((result) => {
                    res.status(200).json({
                        message: "User deleted successfully!",
                        request: {
                            type: "POST",
                            description: "You can create a new user with this url:",
                            url: "http://localhost:3000/users/signup",
                            body: {
                                name: "String",
                                email: "String",
                                password: "String",
                            },
                        },
                    });
                })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });

});


module.exports = router;