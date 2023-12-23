const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        title: { type: String, required: true },
        description: { type: String, required: false },
        date : { type: String, required: true},
        location: { type: String, required: true },
        capacity: { type: Number, required: true },
    },  { timestamps: true }
);
module.exports = mongoose.model('Event', eventSchema);