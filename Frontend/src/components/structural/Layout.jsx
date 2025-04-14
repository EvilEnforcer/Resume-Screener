// src/structural/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ children, logout, username }) {
  return (
    <div className="app-layout">
      <Sidebar logout={logout} username={username} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
