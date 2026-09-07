const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email phone")
            .populate(
                "vehicle",
                "name brand model vehicleNumber pricePerDay"
            )
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

// Confirm booking
const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = "CONFIRMED";
        await booking.save();

        res.status(200).json({
            message: "Booking confirmed successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to confirm booking",
            error: error.message
        });
    }
};

// Complete booking
const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = "COMPLETED";
        await booking.save();

        // Make vehicle available again
        await Vehicle.findByIdAndUpdate(
            booking.vehicle,
            {
                status: "AVAILABLE"
            }
        );

        res.status(200).json({
            message: "Booking completed successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to complete booking",
            error: error.message
        });
    }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(
            req.params.id
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete vehicle",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getAllBookings,
    confirmBooking,
    completeBooking,
    deleteVehicle
};