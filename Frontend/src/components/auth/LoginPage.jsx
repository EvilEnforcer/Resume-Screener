import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import './LoginPage.css';
import abstractImage from '../../assets/abstract.jpg';

function LoginPage(props) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const handleInput = () => {
            const username = usernameRef.current?.value || "";
            const password = passwordRef.current?.value || "";
            setIsButtonDisabled(!(username && password));
        };

        const usernameInput = usernameRef.current;
        const passwordInput = passwordRef.current;

        usernameInput?.addEventListener("input", handleInput);
        passwordInput?.addEventListener("input", handleInput);

        return () => {
            usernameInput?.removeEventListener("input", handleInput);
            passwordInput?.removeEventListener("input", handleInput);
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        fetch("http://18.118.160.111:8080/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
        .then(async res => {
            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem("jwtToken", data.jwtToken);
                localStorage.setItem("username", username);
                props.user(username);
                props.login();
            } else {
                console.error("Backend response:", data);
                setErrorMessage(data.message);
                throw new Error(data.message);
            }
        })
        .catch(err => {
            console.log("step 2")
            console.error("Login failed:", err.message);
        });
    };

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

                    <form onSubmit={handleLogin}>
                        <div className="form-group-login">
                            <label htmlFor="email">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                ref={usernameRef}
                            />
                        </div>

                        <div className="form-group-login">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                ref={passwordRef}
                            />
                        </div>

                        {errorMessage && (
                            <p className="login-error-message">{errorMessage}</p>
                        )}

                        <button
                            className="login-button"
                            type="submit"
                            disabled={isButtonDisabled}
                        >
                            Log In
                        </button>
                    </form>

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
