import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import './LoginPage.css';
import abstractImage from '../../assets/abstract.jpg';

function LoginPage(props) {

    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async(e) => {
        e?.preventDefault();
        setErrorMessage("");

        if (usernameRef.current.value === "" || passwordRef.current.value === "") {
            setErrorMessage("You must provide both a username and password!");
            return;
        }

        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: usernameRef.current.value,
              password: passwordRef.current.value
            })
          })
          .then(async res => {
            const data = await res.json();
            if (res.status === 200) {
              localStorage.setItem("jwtToken", data.jwtToken);
              props.login();
            } else {
              console.error("Backend response:", data);
              setErrorMessage(data.message);
              throw new Error(data.message);
            }
          })
          .catch(err => {
            console.error("Login failed:", err.message);
          });

    }

    return (
        <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        >
            <div className="login-form-section">
                <div className="login-form-box">
                    <h2 className="brand-name-login">Resume Screener</h2>
                    <p>Login to your account</p>

                    <div className="form-group-login">
                        <label htmlFor="email">Username</label>
                        <input type="email" id="email" placeholder="Enter your username" ref={usernameRef} />
                    </div>

                    <div className="form-group-login">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" ref={passwordRef} />
                    </div>

                    {errorMessage && <p className="login-error-message">{errorMessage}</p>}

                    <button className="login-button" onClick={handleLogin}>
                        LogIn
                    </button>

                    <p className="signup-link">
                        Don’t have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>

            <div className="login-image-section">
                <img src={abstractImage} alt="Abstract" />
            </div>
        </motion.div>
    );
}

export default LoginPage;
