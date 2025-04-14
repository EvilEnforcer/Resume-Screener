// src/content/AdminPage.jsx
import React from 'react';
import { motion } from "framer-motion";
import './AdminPage.css';

export default function AdminPage({ logout }) {
  return (
    <motion.div
      className="admin-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <button className="admin-logout" onClick={logout}>Logout</button>
      <div className="admin-box">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-subtitle">This page is under construction.</p>
      </div>
    </motion.div>
  );
}
