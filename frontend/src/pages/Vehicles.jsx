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
    <div className="vehicles-page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Your next journey starts here</p>
          <h1>Find the right ride.</h1>
          <p>Choose from our well-maintained vehicles and book in just a few clicks.</p>
        </div>
        <div className="hero-stat"><strong>{vehicles.length}</strong><span>vehicles ready to go</span></div>
      </section>
      {message && <p className="notice">{message}</p>}

      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <article className="vehicle-card" key={vehicle._id}>
              <div className="vehicle-visual"><span>🚘</span><span className={`status ${vehicle.status?.toLowerCase()}`}>{vehicle.status}</span></div>
              <div className="vehicle-content">
                <p className="vehicle-brand">{vehicle.brand}</p>
                <h2>{vehicle.name}</h2>
                <p className="vehicle-model">{vehicle.model} · {vehicle.vehicleNumber}</p>
                <div className="vehicle-footer">
                  <p className="price"><strong>₹{vehicle.pricePerDay}</strong> / day</p>
                  {vehicle.status === "AVAILABLE" ? <button onClick={() => handleBook(vehicle._id)}>Book now <span>→</span></button> : <span className="unavailable">Currently unavailable</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vehicles;
