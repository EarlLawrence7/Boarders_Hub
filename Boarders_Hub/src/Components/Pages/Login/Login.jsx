import "./Login.css";
import React, { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Adjust the path as needed
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from 'react-icons/fa';  // Import Google icon

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // Check if user is already logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If the user is logged in, redirect them to the home page or dashboard
      navigate("/home");
    }
  }, [navigate]); // Empty dependency array ensures this runs on mount only

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      // Store token in localStorage
      localStorage.setItem("token", user.accessToken);

      if (rememberMe) {
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }

      const role = user.displayName === "Admin" ? "Admin" : "User";

      if (role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert("Error during login: " + error.message);
      console.error("Error during login:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store token in localStorage
      localStorage.setItem("token", user.accessToken);

      const role = user.displayName === "Admin" ? "Admin" : "User";

      if (role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert("Error during Google sign-in: " + error.message);
      console.error("Error during Google sign-in:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <div className="logo-container">
            <div className="logo-text"> </div>
            <img src="/Boardershub.png" alt="Productivity Tracker Logo" className="logo" />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="remember-forgot">
            <label style={{ color: "White" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgotPassword" style={{ color: "white" }}>Forgot password?</a>
          </div>
          <button type="submit">Login</button>

          <div className="google-sign-in-container" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <span style={{ color: "white", marginRight: "5px" }}>or login via </span>
            <button 
              onClick={handleGoogleSignIn} 
              className="google-sign-in"
              style={{
                width: "25px", 
                height: "25px", 
                borderRadius: "50%", 
                backgroundColor: "#4285F4", 
                color: "white", 
                border: "none", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                fontSize: "15px", 
                cursor: "pointer",
              }}
            >
              <FaGoogle />
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <a href="/signup" style={{ color: "white" }}>Create an Account</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
