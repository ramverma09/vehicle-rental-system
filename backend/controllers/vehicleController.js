const Vehicle = require("../models/Vehicle");

// Get all vehicles
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vehicles",
            error: error.message
        });
    }
};

// Get single vehicle
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vehicle",
            error: error.message
        });
    }
};

// Add vehicle
const createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);

        res.status(201).json({
            message: "Vehicle created successfully",
            vehicle
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create vehicle",
            error: error.message
        });
    }
};

// Update vehicle
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update vehicle",
            error: error.message
        });
    }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

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
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};