import "./Login.css";
import React, { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Adjust the path as needed
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  /////////////////////////////////////////////////////////////////////////////////// Token Check
    // Check if user is logged in using Firebase or localStorage token
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          // If a token exists in localStorage, redirect to /home
          navigate("/home");
      } else {
          // Firebase Auth check for logged in user
          onAuthStateChanged(auth, (user) => {
              if (user) {
                  // If Firebase user is logged in, store token and redirect to /home
                  localStorage.setItem("token", user.accessToken);
                  navigate("/home");
              }
          });
      }
  }, [navigate]);
  ////////////////////////////////////////////////////////////////////////////////// Token Check

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
          <button type="submit" className="login-button">Login</button>
          <div className="google-sign-in-container">
            <span className="google-sign-in-text">or Continue with google</span>
            <button onClick={handleGoogleSignIn} className="google-sign-in">
              <img
                src="Google.jpg"
                alt="Google Sign-In"
                className="google-sign-in-image"
              />
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <span style={{ marginRight: "5px" }}>Don't have an account?</span>
            <a href="/signup" style={{ color: "white" }}>Click here.</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
