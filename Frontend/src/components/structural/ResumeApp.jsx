import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';
import ResumeAppUpload from '../content/ResumeAppUpload';
import ResumeDetails from '../content/ResumeDetails';
import ResumeResults from '../content/ResumeResults';
import HomePage from '../content/HomePage';
import Layout from './Layout';
import AdminPage from '../content/AdminPage';
import DownloadPage from '../content/DownloadPage';

function ResumeApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [fileId, setFileId] = useState();
  const [score, setScore] = useState(0);
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const savedUsername = localStorage.getItem("username");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() < expiry) {
          setLoggedIn(true);
          if (savedUsername) setUsername(savedUsername);
        } else {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("username");
        }
      } catch (e) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
      }
    }
  }, []);

  function fileIdHelper(id) {
    setFileId(id);
  }

  function settingUsername(username) {
    setUsername(username);
  }

  function setResults(score, summary, sections) {
    setScore(score);
    setSummary(summary);
    setSections(sections);
  }

  function logIn() {
    setLoggedIn(true);
  }

  function logOut() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    setLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
        {/* Admin-only logic */}
        {loggedIn && username === 'admin' ? (
          <>
            <Route path="/admin" element={<AdminPage logout={logOut} />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            {/* Public routes */}
            <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <LoginPage login={logIn} user={settingUsername} />} />
            <Route path="/register" element={<RegisterPage login={logIn} user={settingUsername} />} />

            {/* Protected routes for normal users */}
            <Route path="/home" element={
              loggedIn ? (
                <Layout logout={logOut} username={username} >
                  <HomePage logout={logOut} />
                </Layout>
              ) : <Navigate to="/" />
            } />

            <Route path="/upload" element={
              loggedIn ? (
                <Layout logout={logOut} username={username} >
                  <ResumeAppUpload idHelper={fileIdHelper} />
                </Layout>
              ) : <Navigate to="/" />
            } />

            <Route path="/details" element={
              loggedIn ? (
                <Layout logout={logOut} username={username} >
                  <ResumeDetails fileid={fileId} setResults={setResults} />
                </Layout>
              ) : <Navigate to="/" />
            } />

            <Route path="/results" element={
              loggedIn ? (
                <Layout logout={logOut} username={username} >
                  <ResumeResults score={score} result={{ score, summary, sections }} />
                </Layout>
              ) : <Navigate to="/" />
            } />

            <Route path="/download" element={
              loggedIn ? (
                <Layout logout={logOut} username={username}>
                  <DownloadPage idHelper={fileIdHelper} />
                </Layout>
              ) : <Navigate to="/" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default ResumeApp;
