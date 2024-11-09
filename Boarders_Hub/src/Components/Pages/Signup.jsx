import "./Signup.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        birthDate: {
            month: "",
            day: "",
            year: ""
        }
    });

    const [formErrors, setFormErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        birthDate: ""
    });

    const navigate = useNavigate(); // To navigate to other pages

    // Check if user is already logged in when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If the user is logged in, redirect them to the home page or dashboard
            navigate("/home");
        }
    }, [navigate]); // Empty dependency array ensures this runs on mount only

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id.includes("birthDate")) {
            const [field] = id.split("-");
            setFormData(prevState => ({
                ...prevState,
                birthDate: {
                    ...prevState.birthDate,
                    [field]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
    };

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        if (!formData.username) {
            formIsValid = false;
            errors.username = "Username is required.";
        }
        if (!formData.password) {
            formIsValid = false;
            errors.password = "Password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            formIsValid = false;
            errors.confirmPassword = "Passwords must match.";
        }
        if (!formData.email) {
            formIsValid = false;
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formIsValid = false;
            errors.email = "Email is invalid.";
        }
        if (!formData.phone) {
            formIsValid = false;
            errors.phone = "Phone number is required.";
        }
        if (!formData.birthDate.month || !formData.birthDate.day || !formData.birthDate.year) {
            formIsValid = false;
            errors.birthDate = "Complete birth date is required.";
        }

        setFormErrors(errors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (validateForm()) {
            console.log("Form submitted successfully", formData);
        }
    };

    return (
        <div className="container">
            <form id="signupForm" className="signup-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.username && <div className="error">{formErrors.username}</div>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.password && <div className="error">{formErrors.password}</div>}
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.confirmPassword && <div className="error">{formErrors.confirmPassword}</div>}
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.email && <div className="error">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                    <label>Phone number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.phone && <div className="error">{formErrors.phone}</div>}
                </div>

                <div className="birth-date">
                    <label>Birth Date</label>
                    <div className="date-inputs">
                        <input
                            type="text"
                            id="birthDate-month"
                            value={formData.birthDate.month}
                            onChange={handleInputChange}
                            placeholder="MM"
                            maxLength="2"
                        />
                        <input
                            type="text"
                            id="birthDate-day"
                            value={formData.birthDate.day}
                            onChange={handleInputChange}
                            placeholder="DD"
                            maxLength="2"
                        />
                        <input
                            type="text"
                            id="birthDate-year"
                            value={formData.birthDate.year}
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            maxLength="4"
                        />
                    </div>
                    {formErrors.birthDate && <div className="error">{formErrors.birthDate}</div>}
                </div>

                <button type="submit" className="signup-btn">Sign up</button>

                <p className="login-link">
                    Already have an account?
                    <a href="/login" className="login-btn">Login</a>
                </p>
            </form>
        </div>
    );
}

export default Signup;
