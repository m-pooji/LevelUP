// src/components/AuthCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- 1. IMPORT AXIOS
import './AuthCard.css';

// 2. Define our backend API URL
const API_URL = 'http://localhost:5000/api'; 

const validateEmail = (email) => { /* (validation function - no change) */
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function AuthCard() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const navigate = useNavigate(); 

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const [registerData, setRegisterData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false); 

  // --- Handlers for state changes (no change) ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({ ...prevData, [name]: value }));
    setLoginErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on type
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prevData => ({ ...prevData, [name]: value }));
    setRegisterErrors(prev => ({ ...prev, [name]: undefined, confirmPassword: undefined })); // Clear errors
  };

  // --- 3. UPDATED Login Submit Handler ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation
    const errors = {};
    if (!loginData.email) errors.email = "Email is required";
    if (!loginData.password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) {
      return setLoginErrors(errors);
    }
    setLoginErrors({});

    // Send to backend API
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: loginData.email,
        password: loginData.password,
      });

      // Login success!
      console.log("Login successful:", response.data);
      const user = response.data.user;

      // Navigate to the dashboard, passing the user's ID in the URL!
      navigate(`/dashboard/${user.id}`); 

    } catch (error) {
      // Handle errors from the backend
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        // Show server error (e.g., "Invalid credentials")
        setLoginErrors({ form: error.response.data.message });
      } else {
        setLoginErrors({ form: "Login failed. Please try again." });
      }
    }
  };

  // --- 4. UPDATED Register Submit Handler ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation
    const errors = {};
    if (!registerData.username) errors.username = "Username is required";
    if (!registerData.email) errors.email = "Email is required";
    else if (!validateEmail(registerData.email)) errors.email = "Please enter a valid email";
    if (!registerData.password) errors.password = "Password is required";
    else if (registerData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (registerData.password !== registerData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    
    if (Object.keys(errors).length > 0) {
      return setRegisterErrors(errors);
    }
    setRegisterErrors({});
    setRegisterSuccess(false);

    // Send to backend API
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword
      });

      // Register success!
      console.log("Register successful:", response.data);
      setRegisterSuccess(true); 
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });

      setTimeout(() => {
        setRegisterSuccess(false);
        handleLoginClick();
      }, 2000); 

    } catch (error) {
      // Handle errors (e.g., "Email already in use")
      console.error("Register Error:", error);
      if (error.response && error.response.data) {
        setRegisterErrors({ form: error.response.data.message });
      } else {
        setRegisterErrors({ form: "Registration failed. Please try again." });
      }
    }
  };

  // --- Toggling Handlers (no change) ---
  const handleRegisterClick = () => { /* ... (no change) ... */
    setIsRegisterActive(true);
    setLoginErrors({});
    setRegisterErrors({});
    setLoginData({ email: '', password: '' });
  };
  const handleLoginClick = () => { /* ... (no change) ... */
    setIsRegisterActive(false);
    setLoginErrors({});
    setRegisterErrors({});
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  // --- JSX (almost no change, just adding server error spots) ---
  return (
    <div className="auth-card-wrapper">
      <div className={`auth-card-container ${isRegisterActive ? 'register-active' : ''}`}>
        
        {/* --- Sign-Up Form (UPDATED) --- */}
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
            <h2 className="panel-title">Create Account</h2>
            
            {registerErrors.form && <p className="error-message">{registerErrors.form}</p>}
            
            <input type="text" placeholder="Username" className="auth-input" name="username" value={registerData.username} onChange={handleRegisterChange} />
            {registerErrors.username && <p className="error-message">{registerErrors.username}</p>}

            <input type="email" placeholder="Email" className="auth-input" name="email" value={registerData.email} onChange={handleRegisterChange} />
            {registerErrors.email && <p className="error-message">{registerErrors.email}</p>}

            <input type="password" placeholder="Password" className="auth-input" name="password" value={registerData.password} onChange={handleRegisterChange} />
            {registerErrors.password && <p className="error-message">{registerErrors.password}</p>}

            <input type="password" placeholder="Confirm Password" className="auth-input" name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterChange} />
            {registerErrors.confirmPassword && <p className="error-message">{registerErrors.confirmPassword}</p>}

            <button type="submit" className="auth-button">REGISTER</button>
            
            {registerSuccess && <p className="success-message">Registered successfully!</p>}
          </form>
        </div>

        {/* --- Sign-In Form (UPDATED) --- */}
        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            <h2 className="panel-title">Sign In</h2>
            
            {loginErrors.form && <p className="error-message">{loginErrors.form}</p>}

            <input type="email" placeholder="Email" className="auth-input" name="email" value={loginData.email} onChange={handleLoginChange} />
            {loginErrors.email && <p className="error-message">{loginErrors.email}</p>}

            <input type="password" placeholder="Password" className="auth-input" name="password" value={loginData.password} onChange={handleLoginChange} />
            {loginErrors.password && <p className="error-message">{loginErrors.password}</p>}

            <div className="form-options">
              <label className="remember-me"><input type="checkbox" /> Remember me</label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <button type="submit" className="auth-button login-button">LOGIN</button>
          </form>
        </div>

        {/* --- Overlay Container (no change) --- */}
        <div className="overlay-container">
          <div className="overlay">
            {/* ... (no change to overlay panels) ... */}
            <div className="overlay-panel overlay-left">
              <h2 className="panel-title">Welcome Back!</h2>
              <p className="panel-description">Already have an account? Log in to continue your journey!</p>
              <button className="panel-button ghost-button" onClick={handleLoginClick}>LOGIN</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2 className="panel-title">Hello, Friend!</h2>
              <p className="panel-description">Don't have an account? Register to level up your life!</p>
              <button className="panel-button ghost-button" onClick={handleRegisterClick}>REGISTER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;