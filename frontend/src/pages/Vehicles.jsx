import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/api/vehicles");

      setVehicles(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

 const handleBook = (vehicleId) => {
  navigate(`/book/${vehicleId}`);
};

  if (loading) {
    return <h2>Loading vehicles...</h2>;
  }

  return (
    <div>
      <h1>Available Vehicles</h1>

      {message && <p>{message}</p>}

      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        <div>
          {vehicles.map((vehicle) => (
            <div key={vehicle._id}>
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
                <strong>Price per day:</strong> ₹
                {vehicle.pricePerDay}
              </p>

              <p>
                <strong>Status:</strong> {vehicle.status}
              </p>

              {vehicle.status === "AVAILABLE" && (
                <button onClick={() => handleBook(vehicle._id)}>
    Book Now
  </button>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vehicles;