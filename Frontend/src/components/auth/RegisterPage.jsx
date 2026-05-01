import React, { useRef, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import './RegisterPage.css';
import abstractImage from '../../assets/abstract.jpg';

function RegisterPage(props) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [registered, setRegistered] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const handleInput = () => {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      const rePassword = rePasswordRef.current?.value || "";

      setIsButtonDisabled(!(username && password && rePassword));
    };

    const inputs = [usernameRef.current, passwordRef.current, rePasswordRef.current];
    inputs.forEach(input => input?.addEventListener("input", handleInput));
    return () => {
      inputs.forEach(input => input?.removeEventListener("input", handleInput));
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (rePasswordRef.current.value !== passwordRef.current.value) {
      setErrorMessage("Your password doesn't match!")
      return;
    }

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(async res => {
      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("jwtToken", data.jwtToken);
        localStorage.setItem("username", username);
        props.user(username);
        props.login();
        setRegistered(true);
      } else {
        console.error("Backend response:", data);
        setErrorMessage(data.message);
        throw new Error(data.message);
      }
    })
    .catch(err => {
      console.error("Register failed:", err.message);
    });
  };

  if (registered) {
    return <Navigate to="/home" />;
  }

  return (
    <motion.div 
      className="register-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="register-form-section">
        <div className="register-form-box">
          <h2 className="brand-name-register">Resume Screener</h2>
          <p>Sign up to get started</p>

          <form onSubmit={handleRegister}>
            <div className="form-group-register">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Enter your username" ref={usernameRef} />
            </div>

            <div className="form-group-register">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" ref={passwordRef} />
            </div>

            <div className="form-group-register">
              <label htmlFor="password-re">Re-Enter Password</label>
              <input type="password" id="password-re" placeholder="Re-Enter your password" ref={rePasswordRef} />
            </div>

            {errorMessage && <p className="register-error-message">{errorMessage}</p>}

            <button className="register-button" type="submit" disabled={isButtonDisabled}>
              Sign Up
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="register-image-section">
        <img src={abstractImage} alt="Abstract" />
      </div>
    </motion.div>
  );
}

export default RegisterPage;
