import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
    } catch (error) {
      console.log("BOOKINGS ERROR:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Booking cancelled successfully");

      fetchBookings();
    } catch (error) {
      console.log("CANCEL ERROR:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  if (loading) {
    return <h2>Loading bookings...</h2>;
  }

  return (
    <div>
      <h1>My Bookings</h1>

      {message && <p>{message}</p>}

      {bookings.length === 0 ? (
        <div>
          <p>You have no bookings.</p>

          <button onClick={() => navigate("/vehicles")}>
            Browse Vehicles
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking._id}>
              <h2>
                {booking.vehicleId?.name || "Vehicle"}
              </h2>

              <p>
                <strong>Vehicle Number:</strong>{" "}
                {booking.vehicleId?.vehicleNumber || "N/A"}
              </p>

              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>

              <p>
                <strong>End Date:</strong>{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Total Amount:</strong> ₹
                {booking.totalAmount || 0}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {booking.status}
              </p>

              {booking.status === "CONFIRMED" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}

      <br />

      <button onClick={() => navigate("/vehicles")}>
        Back to Vehicles
      </button>
    </div>
  );
}

export default MyBookings;