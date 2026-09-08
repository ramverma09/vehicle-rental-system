import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [profileOpen, setProfileOpen] = useState(false);
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const displayName = user.name || "DriveEasy user";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  if (!token || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/vehicles" className="logo">
          <span className="logo-mark">D</span><span>DriveEasy</span>
        </Link>

        <div className="nav-links">
          <Link className={location.pathname === "/vehicles" ? "active" : ""} to="/vehicles">Explore cars</Link>
          <Link className={location.pathname === "/bookings" ? "active" : ""} to="/bookings">My trips</Link>
          <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">Admin</Link>

          <div className="profile-menu">
            <button
              className="profile-trigger"
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              {initial}
            </button>
            {profileOpen && (
              <div className="profile-popover">
                <div className="profile-summary">
                  <span className="profile-avatar">{initial}</span>
                  <div>
                    <strong>{displayName}</strong>
                    <span>{user.email || "Signed in"}</span>
                  </div>
                </div>
                <p className="profile-role">{user.role || "CUSTOMER"}</p>
              </div>
            )}
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/vehicles" element={<Vehicles />} />

          <Route path="/book/:vehicleId" element={<Booking />} />

          <Route path="/bookings" element={<MyBookings />} />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
