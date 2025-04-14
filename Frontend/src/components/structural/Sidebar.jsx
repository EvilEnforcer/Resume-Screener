import React from 'react';
import { FaHome, FaDownload, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ logout, username }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/home';
  const isDownload = location.pathname === '/download';

  // Dynamic menu based on route
  const menuItems = isDownload
    ? [
        {
          icon: <FaPlus />,
          label: 'Upload',
          onClick: () => navigate('/upload'),
        },
        {
          icon: <FaHome />,
          label: 'Home',
          onClick: () => navigate('/home'),
        },
        {
          icon: <FaSignOutAlt />,
          label: 'Logout',
          onClick: logout,
        },
      ]
    : [
        isHome
          ? {
              icon: <FaPlus />,
              label: 'Upload',
              onClick: () => navigate('/upload'),
            }
          : {
              icon: <FaHome />,
              label: 'Home',
              onClick: () => navigate('/home'),
            },
        {
          icon: <FaDownload />,
          label: 'Download',
          onClick: () => navigate('/download'),
        },
        {
          icon: <FaSignOutAlt />,
          label: 'Logout',
          onClick: logout,
        },
      ];

  return (
    <div className="custom-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="line1">Resume</span>
          <span className="line2">Analyzer</span>
        </div>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(({ icon, label, onClick }) => (
          <li
            key={label}
            className={`sidebar-item ${
              label === 'Upload' ? 'upload-button' : ''
            }`}
            onClick={onClick}
          >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
          </li>
        ))}
      </ul>

      {/* Username at bottom */}
      {username && (
        <div className="sidebar-username">
          <div className="avatar-circle">{username.charAt(0).toUpperCase()}</div>
          <div className="username-text">@{username}</div>
        </div>
      )}
    </div>
  );
}
