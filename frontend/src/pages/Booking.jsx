import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Booking() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const response = await api.get(`/api/vehicles/${vehicleId}`);

      setVehicle(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load vehicle"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!startDate || !endDate) {
      setMessage("Please select both dates");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setMessage("End date must be after start date");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    try {
      setBookingLoading(true);

      const response = await api.post(
        "/api/bookings",
        {
          vehicleId: vehicleId,
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message || "Booking successful!"
      );

      setTimeout(() => {
        navigate("/vehicles");
      }, 1000);
    } catch (error) {
      console.log("BOOKING ERROR:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading vehicle...</h2>;
  }

  if (!vehicle) {
    return (
      <div>
        <h2>Vehicle not found</h2>
        <p>{message}</p>
        <button onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Book Vehicle</h1>

      <h2>{vehicle.name}</h2>

      <p>
        <strong>Brand:</strong> {vehicle.brand}
      </p>

      <p>
        <strong>Model:</strong> {vehicle.model}
      </p>

      <p>
        <strong>Vehicle Number:</strong>{" "}
        {vehicle.vehicleNumber}
      </p>

      <p>
        <strong>Price Per Day:</strong> ₹
        {vehicle.pricePerDay}
      </p>

      <p>
        <strong>Status:</strong> {vehicle.status}
      </p>

      <hr />

      <h3>Select Booking Dates</h3>

      <form onSubmit={handleBooking}>
        <div>
          <label>Start Date</label>
          <br />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
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
            min={startDate || new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={bookingLoading}>
          {bookingLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <br />

      <button onClick={() => navigate("/vehicles")}>
        Back to Vehicles
      </button>
    </div>
  );
}

export default Booking;