import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    specialization: "",
    experienceYears: "",
    educationalInstitute: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Custom validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await axios.post("/api/users/register", payload);

      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error(error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        }}
      />

      <div style={{ flex: 1, zIndex: 1, paddingLeft: "40px" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>CaseSphere</h1>
        <p style={{ fontSize: "1.5rem" }}>Your Legal Research, Simplified</p>
        <p>
          Already have an account?{" "}
          <button
            onClick={handleLogin}
            style={{
              color: "green",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </p>
      </div>

      <div
        style={{
          flex: 1,
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleRegister}
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "30px",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "500px",
            opacity: 0.95,
            color: "black",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h3>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Confirm Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Select User Type <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select user type</option>
              <option value="Lawyer">Lawyer</option>
              <option value="LawStudent">Law Student</option>
            </select>
          </div>

          {formData.userType === "Lawyer" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label>
                  Specialization <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter your specialization"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>
                  Years of Experience <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </>
          )}

          {formData.userType === "LawStudent" && (
            <div style={{ marginBottom: "15px" }}>
              <label>
                Educational Institute <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="educationalInstitute"
                value={formData.educationalInstitute}
                onChange={handleChange}
                placeholder="Enter your institute"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
