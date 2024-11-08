import "./Login.css";
import React, { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Adjust the path as needed
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("username");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

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
        navigate("/Home");
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
        navigate("/Home");
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
        </form>

        <button onClick={handleGoogleSignIn} className="google-sign-in">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
