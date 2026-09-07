import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get(
        "/api/vehicles",
        authConfig
      );

      setVehicles(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get(
        "/api/admin/bookings",
        authConfig
      );

      setBookings(response.data);
    } catch (error) {
      console.log("Bookings error:", error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/admin/vehicles",
        {
          name,
          brand,
          model,
          vehicleNumber,
          pricePerDay: Number(pricePerDay),
        },
        authConfig
      );

      setMessage("Vehicle added successfully");

      setName("");
      setBrand("");
      setModel("");
      setVehicleNumber("");
      setPricePerDay("");

      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add vehicle"
      );
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) {
      return;
    }

    try {
      await api.delete(
        `/api/admin/vehicles/${id}`,
        authConfig
      );

      setMessage("Vehicle deleted successfully");

      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await api.put(
        `/api/admin/bookings/${id}`,
        { status },
        authConfig
      );

      setMessage(`Booking ${status}`);

      fetchBookings();
      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update booking"
      );
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {message && <p>{message}</p>}

      <hr />

      <h2>Add Vehicle</h2>

      <form onSubmit={handleAddVehicle}>
        <input
          type="text"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) =>
            setVehicleNumber(e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Price Per Day"
          value={pricePerDay}
          onChange={(e) =>
            setPricePerDay(e.target.value)
          }
          required
        />

        <button type="submit">
          Add Vehicle
        </button>
      </form>

      <hr />

      <h2>All Vehicles</h2>

      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div key={vehicle._id}>
            <h3>{vehicle.name}</h3>

            <p>
              Brand: {vehicle.brand}
            </p>

            <p>
              Model: {vehicle.model}
            </p>

            <p>
              Vehicle Number: {vehicle.vehicleNumber}
            </p>

            <p>
              Price: ₹{vehicle.pricePerDay}
            </p>

            <p>
              Status: {vehicle.status}
            </p>

            <button
              onClick={() =>
                handleDeleteVehicle(vehicle._id)
              }
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}

      <h2>All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id}>
            <h3>
              {booking.vehicle?.name || "Vehicle"}
            </h3>

            <p>
              User:{" "}
              {booking.user?.name || "N/A"}
            </p>

            <p>
              Start Date:{" "}
              {new Date(
                booking.startDate
              ).toLocaleDateString()}
            </p>

            <p>
              End Date:{" "}
              {new Date(
                booking.endDate
              ).toLocaleDateString()}
            </p>

            <p>
              Total: ₹{booking.totalAmount}
            </p>

            <p>
              Status: {booking.status}
            </p>

            {booking.status === "PENDING" && (
              <>
                <button
                  onClick={() =>
                    handleBookingStatus(
                      booking._id,
                      "APPROVED"
                    )
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleBookingStatus(
                      booking._id,
                      "REJECTED"
                    )
                  }
                >
                  Reject
                </button>
              </>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
