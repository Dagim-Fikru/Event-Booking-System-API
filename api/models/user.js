const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email address!`,
            },
            unique: true,
        },
        password: { type: String, required: true, minLength: 6 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);