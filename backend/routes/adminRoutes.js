const express = require("express");

const {
    getUsers,
    getAllBookings,
    confirmBooking,
    completeBooking,
    deleteVehicle
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", protect, admin, getUsers);

router.get("/bookings", protect, admin, getAllBookings);

router.put(
    "/bookings/:id/confirm",
    protect,
    admin,
    confirmBooking
);

router.put(
    "/bookings/:id/complete",
    protect,
    admin,
    completeBooking
);

router.delete(
    "/vehicles/:id",
    protect,
    admin,
    deleteVehicle
);

module.exports = router;