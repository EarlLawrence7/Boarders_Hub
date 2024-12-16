import "./Signup.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import { createUserWithEmailAndPassword, signOut } from "firebase/auth"; // Firebase Auth imports
import { doc, setDoc } from "firebase/firestore"; // Firestore imports
import { auth, db, redirectToHomeIfLoggedIn } from "../Login/firebaseConfig"; // Adjust the path as needed

function Signup() {
    const navigate = useNavigate();

    // To check if currently logged in: true->redirect to home, false->login
    redirectToHomeIfLoggedIn(navigate);

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
        birthDate: {
            month: "",
            day: "",
            year: ""
        }
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id.startsWith("birthDate-")) {
            const field = id.split("-")[1];
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
        let errors = { birthDate: {} };
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
            /*errors.confirmPassword = "";*/
            alert("Passwords must match.");
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
        } else if (!/^\d{11}$/.test(formData.phone)) {
            formIsValid = false;
            alert ("Phone number must be 11 digits.");
        }
        if (!formData.birthDate.month) {
            formIsValid = false;
            errors.birthDate.month = "Month is required.";
        }
        if (!formData.birthDate.day) {
            formIsValid = false;
            errors.birthDate.day = "Day is required.";
        }
        if (!formData.birthDate.year) {
            formIsValid = false;
            errors.birthDate.year = "Year is required.";
        }

        setFormErrors(errors);
        return formIsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Create the user with email and password using Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                const user = userCredential.user;

                // After the user is created, save the additional details in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    birthDate: formData.birthDate
                });

                console.log("User created and data saved successfully");

                // Log the user out after account creation
                await signOut(auth);

                // Show a message that the user can log in
                alert("Account created successfully! Please log in.");

                // Redirect the user to the login page
                navigate("/login"); // Navigate to login page, without logging the user in

            } catch (error) {
                console.error("Error during signup:", error.message);
                 // Handle error using alert
                    alert("Email already in use");
            }
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
                        aria-invalid={!!formErrors.username}
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
                        aria-invalid={!!formErrors.password}
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
                        aria-invalid={!!formErrors.confirmPassword}
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
                        aria-invalid={!!formErrors.email}
                        required
                    />
                    {formErrors.email && <div className="error">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        aria-invalid={!!formErrors.phone}
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
                            inputMode="numeric"
                            aria-invalid={!!formErrors.birthDate.month}
                        />
                        <input
                            type="text"
                            id="birthDate-day"
                            value={formData.birthDate.day}
                            onChange={handleInputChange}
                            placeholder="DD"
                            maxLength="2"
                            inputMode="numeric"
                            aria-invalid={!!formErrors.birthDate.day}
                        />
                        <input
                            type="text"
                            id="birthDate-year"
                            value={formData.birthDate.year}
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            maxLength="4"
                            inputMode="numeric"
                            aria-invalid={!!formErrors.birthDate.year}
                        />
                    </div>
                    {Object.values(formErrors.birthDate).some(error => error) && (
                        <div className="error">
                        {formErrors.birthDate.month && (
                            <div style={{ color: 'red' }}>{formErrors.birthDate.month}</div>
                        )}
                        {formErrors.birthDate.day && (
                            <div style={{ color: 'red' }}>{formErrors.birthDate.day}</div>
                        )}
                        {formErrors.birthDate.year && (
                            <div style={{ color: 'red' }}>{formErrors.birthDate.year}</div>
                        )}
                        </div>
                    )}
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
