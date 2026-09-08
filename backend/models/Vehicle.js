const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        model: {
            type: String,
            required: true
        },

        vehicleNumber: {
            type: String,
            required: true,
            unique: true
        },

        category: {
            type: String,
            enum: ["CAR", "BIKE", "SUV"],
            default: "CAR"
        },

        pricePerDay: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "BOOKED"],
            default: "AVAILABLE"
        },

        imageUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
