import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import './ResumeAppUpload.css';

export default function ResumeApp(props) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://18.118.160.111:8080/document/myfiles", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUploadedFiles(data);
        } else {
          setUploadedFiles([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch uploaded files:", err);
        setUploadedFiles([]);
      })
      .finally(() => setLoadingFiles(false));
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://18.118.160.111:8080/document/upload", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      },
      body: formData
    })
      .then(async res => {
        const data = await res.json();
        if (res.status === 200) {
          props.idHelper(data.id)
          navigate("/details");
        } else {
          setErrorMessage(data.message);
          throw new Error(data.message);
        }
      })
      .catch(err => {
        console.error("Upload failed:", err.message);
      });
  };

  return (
    
      <motion.div
        className="resume-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        
        <div className="main-container">
          <div className="content-wrapper">
            {/* File List Sidebar */}
            <div className="sidebar-file-list">
              <h2>Use Uploaded Resumes</h2>
              <div className="file-list-scroll">
                {loadingFiles ? (
                  <p className="file-loading">Loading resumes...</p>
                ) : uploadedFiles.length === 0 ? (
                  <p className="file-empty">You haven’t uploaded any resumes yet.</p>
                ) : (
                  <ul className="file-list">
                    {uploadedFiles.map(file => (
                      <li key={file.id} className="file-item" onClick={() => {
                        props.idHelper(file.id);
                        navigate("/details");
                      }}>
                        {file.filename}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="upload-area">
              <h1 className="resume-title">Upload Your Resume</h1>
              <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="drop-content">
                  <FaUpload size={40} className="upload-icon" />
                  <p className="drop-text">Upload your resume to get started</p>
                  <p className="file-format-note">as .pdf or .docx file</p>
                  <label className="upload-label">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    Choose File
                  </label>
                </div>

                {fileName && (
                  <div className="upload-status">
                    <p className="file-name">Uploading: {fileName}</p>
                    <p className="loading-text">Please wait...</p>
                  </div>
                )}
              </div>
              {errorMessage && <p className="home-error-message">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    
  );
}
