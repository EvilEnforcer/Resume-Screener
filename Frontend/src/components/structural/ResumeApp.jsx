import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';
import ResumeAppHome from '../content/ResumeAppHome';

function ResumeApp() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() < expiry) {
          setLoggedIn(true);
        } else {
          localStorage.removeItem("jwtToken");
        }
      } catch (e) {
        localStorage.removeItem("jwtToken");
      }
    }
  }, []);

  function logIn() {
    setLoggedIn(true);
  }

  function logOut() {
    localStorage.removeItem("jwtToken");
    setLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <LoginPage login={logIn}/>} />
        <Route path="/register" element={<RegisterPage login={logIn}/>} />
        <Route path="/home" element={loggedIn ? <ResumeAppHome logout={logOut}/> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default ResumeApp;