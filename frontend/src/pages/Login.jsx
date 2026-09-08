import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      // Save JWT
      localStorage.setItem("token", response.data.token);

      // Save user if backend sends it
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/vehicles");
      }, 500);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <p className="auth-brand"><span>D</span> DriveEasy</p>
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to your account</h1>
        <p className="auth-subtitle">Manage your bookings and hit the road.</p>

        <form onSubmit={handleLogin}>

          <label>Email address</label><input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label><input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {message && <p className="notice">{message}</p>}

        <p>
          New to DriveEasy? <Link to="/register">Create an account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
