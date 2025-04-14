import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import './HomePage.css';

const HomePage = (props) => {
  const navigate = useNavigate();

  const handleScan = () => {
    navigate('/upload');
  };

  const handleDownload = () => {
    navigate('/download');
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="home-box">
        <h1 className="home-title">Resume Analyzer</h1>
        <button className="home-button" onClick={handleScan}>Scan</button>
        <button className="home-button" onClick={handleDownload}>Download</button>
        <button className="home-button logout" onClick={props.logout}>Logout</button>
      </div>
    </motion.div>
  );
};

export default HomePage;