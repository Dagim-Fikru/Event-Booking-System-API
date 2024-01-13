import express from "express";
import mongoose from "mongoose";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserController from "../controllers/userController";
import checkAuth from "../middleware/check-auth";

const router = express.Router();

router.post("/signup",UserController.user_signup );

router.post("/login",UserController.user_login);

router.get("/",checkAuth, UserController.get_all_users);

router.get("/:userId", checkAuth, UserController.get_individual_user );

router.put("/:userId",checkAuth, UserController.update_user);

router.delete("/:userId",checkAuth, UserController.delete_user );




export default router;