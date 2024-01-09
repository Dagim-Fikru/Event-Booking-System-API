const express = require('express');

const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const eventRoutes = require('./api/routes/events');
const bookingRoutes = require('./api/routes/bookings');
const userRoutes = require('./api/routes/users');

mongoose.connect(
    "mongodb+srv://eventbooking:1234@eventbookingrestfulapi.ixodsbt.mongodb.net/?retryWrites=true&w=majority"
);

app.use(morgan('dev')); // to log incoming requests

app.use(bodyParser.urlencoded({ extended: false })); // extract simple bodies
app.use(bodyParser.json()); // extract json data and make it easy to read

app.use((req, res, next) => {
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

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; // set the status code
    next(error); // forward the error request
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); // set the status code
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; // export the app object