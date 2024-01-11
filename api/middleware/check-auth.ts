import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error("Token not found");
        }
        dotenv.config();
        if (!process.env.JWT_KEY) {
            throw new Error("JWT Key not found in environment variables");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(token);
        req.body.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed",
        });
    }
};

export default checkAuth;
