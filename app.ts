
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import eventRoutes from './api/routes/events';
import bookingRoutes from './api/routes/bookings';
import userRoutes from './api/routes/users';
import homeRoutes from './api/routes/home';
import dotenv from 'dotenv';




const app = express();

class CustomError extends Error {
    public status: number;

    constructor(message?: string, status?: number) {
        super(message); // Pass the message to the Error constructor
        this.status = status !== undefined ? status : 500; // Default to 500 if status is undefined
    }
}

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable");
}

mongoose.connect(process.env.MONGO_URI);


app.use(morgan('dev')); // to log incoming requests

app.use(bodyParser.urlencoded({ extended: false })); // extract simple bodies
app.use(bodyParser.json()); // extract json data and make it easy to read

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // allow access to any client
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // which headers to accept
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // which methods to accept
        return res.status(200).json({});
    }
    next();
});

// middleware to handle incoming requests
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);
app.use('/', homeRoutes);

// error handling
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const error = new CustomError('Not found', 404);
    error.status = 404; // set the status code
    next(error); // forward the error request
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(error.status || 500); // set the status code
    res.json({
        error: {
            message: error.message
        }
    });
});

export default app; // export the app object
