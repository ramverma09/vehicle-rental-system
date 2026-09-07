const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// Create booking
const createBooking = async (req, res) => {
    try {
        const {
            vehicleId,
            startDate,
            endDate
        } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicle.status === "BOOKED") {
            return res.status(400).json({
                message: "Vehicle is already booked"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const days = Math.ceil(
            (end - start) / millisecondsPerDay
        );

        const totalAmount = days * vehicle.pricePerDay;

        const booking = await Booking.create({
            user: req.user.id,
            vehicle: vehicleId,
            startDate: start,
            endDate: end,
            totalAmount
        });

        vehicle.status = "BOOKED";
        await vehicle.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });
    }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id
        })
        .populate("vehicle", "name brand model vehicleNumber pricePerDay")
        .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status === "CANCELLED") {
            return res.status(400).json({
                message: "Booking already cancelled"
            });
        }

        booking.status = "CANCELLED";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelBooking
};