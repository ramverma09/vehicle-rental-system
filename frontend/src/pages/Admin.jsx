import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({
    name: "",
    brand: "",
    model: "",
    vehicleNumber: "",
    category: "CAR",
    pricePerDay: "",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // FETCH ADMIN DATA
  // =========================

  const fetchBookings = async () => {
    try {
      const response = await api.get(
        "/api/admin/bookings",
        config
      );

      setBookings(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(
        "/api/admin/users",
        config
      );

      setUsers(response.data);
    } catch (error) {
      console.log("Users error:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/api/vehicles");

      setVehicles(response.data);
    } catch (error) {
      console.log("Vehicles error:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchBookings(),
      fetchUsers(),
      fetchVehicles(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // ADD VEHICLE
  // =========================

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      await api.post(
        "/api/vehicles",
        {
          ...vehicle,
          pricePerDay: Number(vehicle.pricePerDay),
        },
        config
      );

      setMessage("Vehicle added successfully!");

      setVehicle({
        name: "",
        brand: "",
        model: "",
        vehicleNumber: "",
        category: "CAR",
        pricePerDay: "",
      });

      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add vehicle"
      );
    }
  };

  // =========================
  // DELETE VEHICLE
  // =========================

  const handleDeleteVehicle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/api/admin/vehicles/${id}`,
        config
      );

      setMessage("Vehicle deleted successfully!");

      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  };

  // =========================
  // CONFIRM BOOKING
  // =========================

  const handleConfirmBooking = async (id) => {
    try {
      await api.put(
        `/api/admin/bookings/${id}/confirm`,
        {},
        config
      );

      setMessage("Booking confirmed successfully!");

      fetchBookings();
      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to confirm booking"
      );
    }
  };

  // =========================
  // COMPLETE BOOKING
  // =========================

  const handleCompleteBooking = async (id) => {
    try {
      await api.put(
        `/api/admin/bookings/${id}/complete`,
        {},
        config
      );

      setMessage("Booking completed successfully!");

      fetchBookings();
      fetchVehicles();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to complete booking"
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <h2>Loading Admin Dashboard...</h2>;
  }

  // =========================
  // UI
  // =========================

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      <hr />

      {/* ================= USERS ================= */}

      <h2>Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user._id}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <hr />
          </div>
        ))
      )}

      {/* ================= ADD VEHICLE ================= */}

      <h2>Add Vehicle</h2>

      <form onSubmit={handleAddVehicle}>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          value={vehicle.name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={vehicle.brand}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="model"
          placeholder="Model"
          value={vehicle.model}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={vehicle.vehicleNumber}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <select
          name="category"
          value={vehicle.category}
          onChange={handleChange}
          required
        >
          <option value="CAR">Car</option>
          <option value="SUV">SUV</option>
          <option value="BIKE">Bike</option>
        </select>

        <br />
        <br />

        <input
          type="number"
          name="pricePerDay"
          placeholder="Price Per Day"
          value={vehicle.pricePerDay}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Add Vehicle
        </button>
      </form>

      <hr />

      {/* ================= VEHICLES ================= */}

      <h2>Vehicles</h2>

      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        vehicles.map((item) => (
          <div key={item._id}>
            <h3>{item.name}</h3>

            <p>
              <strong>Brand:</strong> {item.brand}
            </p>

            <p>
              <strong>Model:</strong> {item.model}
            </p>

            <p>
              <strong>Vehicle Number:</strong>{" "}
              {item.vehicleNumber}
            </p>

            <p>
              <strong>Price Per Day:</strong> ₹
              {item.pricePerDay}
            </p>

            <p>
              <strong>Status:</strong> {item.status}
            </p>

            <button
              onClick={() =>
                handleDeleteVehicle(item._id)
              }
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}

      {/* ================= BOOKINGS ================= */}

      <h2>All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id}>
            <p>
              <strong>Booking ID:</strong>{" "}
              {booking._id}
            </p>

            <p>
              <strong>User:</strong>{" "}
              {booking.user?.name || booking.user}
            </p>

            <p>
              <strong>Vehicle:</strong>{" "}
              {booking.vehicle?.name}
            </p>

            <p>
              <strong>Vehicle Number:</strong>{" "}
              {booking.vehicle?.vehicleNumber}
            </p>

            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(
                booking.startDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>End Date:</strong>{" "}
              {new Date(
                booking.endDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Total Amount:</strong> ₹
              {booking.totalAmount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {booking.status}
            </p>

            {booking.status === "PENDING" && (
              <button
                onClick={() =>
                  handleConfirmBooking(booking._id)
                }
              >
                Confirm Booking
              </button>
            )}

            {booking.status === "CONFIRMED" && (
              <button
                onClick={() =>
                  handleCompleteBooking(booking._id)
                }
              >
                Complete Booking
              </button>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
