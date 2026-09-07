import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookVehicle() {
    const location = useLocation();
    const navigate = useNavigate();

    const vehicle = location.state?.vehicle;

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!vehicle) {
        return (
            <div>
                <h2>Vehicle not selected</h2>
                <button onClick={() => navigate("/vehicles")}>
                    Back to Vehicles
                </button>
            </div>
        );
    }

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference = end - start;
        const days = difference / (1000 * 60 * 60 * 24);

        return days > 0 ? days : 0;
    };

    const days = calculateDays();
    const totalAmount = days * vehicle.pricePerDay;

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setMessage("Please select both dates");
            return;
        }

        if (days <= 0) {
            setMessage("End date must be after start date");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post("/bookings", {
                vehicleId: vehicle._id,
                startDate,
                endDate
            });

            setMessage(
                response.data.message || "Booking created successfully"
            );

            setTimeout(() => {
                navigate("/bookings");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Booking failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page">
            <h1>Book Vehicle</h1>

            <div>
                <h2>{vehicle.name}</h2>
                <p>Brand: {vehicle.brand}</p>
                <p>Model: {vehicle.model}</p>
                <p>Vehicle Number: {vehicle.vehicleNumber}</p>
                <p>Price per day: ₹{vehicle.pricePerDay}</p>
            </div>

            <form onSubmit={handleBooking}>
                <div>
                    <label>Start Date</label>
                    <br />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>End Date</label>
                    <br />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <br />

                <p>Number of days: {days}</p>

                <h3>Total Amount: ₹{totalAmount}</h3>

                <button type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default BookVehicle;