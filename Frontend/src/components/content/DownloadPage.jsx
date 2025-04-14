import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa';
import { motion } from "framer-motion";
import './DownloadPage.css';

export default function DownloadPage(props) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("http://18.118.160.111:8080/document/myfiles", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
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
            .finally(() => {
                setLoadingFiles(false);
            });
    }, []);


    const handleFileDownload = async (file) => {
        props.idHelper(file.id); // optional: keep tracking clicked file
        setErrorMessage("");

        try {
            const res = await fetch(`http://18.118.160.111:8080/document/download/${file.id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (res.status === 200) {
                // To download, we need to convert response to blob and create link
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = file.filename;
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                const data = await res.json();
                setErrorMessage(data.message || "Download failed.");
                throw new Error(data.message);
            }
        } catch (err) {
            console.error("Download failed:", err.message);
            setErrorMessage("Download failed: " + err.message);
        }
    };

    return (
        <motion.div
            className="download-page"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="download-box">
                <h1 className="download-title">Your Files</h1>

                {errorMessage && <p className="home-error-message">{errorMessage}</p>}

                {loadingFiles ? (
                    <p className="download-loading">Loading files...</p>
                ) : uploadedFiles.length === 0 ? (
                    <p className="download-empty">You haven’t uploaded any files yet.</p>
                ) : (
                    <div className="file-list-scroll">
                        <ul className="file-list">
                            {uploadedFiles.map((file, index) => {
                                const isPDF = file.filename.toLowerCase().endsWith('.pdf');
                                const icon = isPDF
                                    ? <FaFilePdf className="file-icon pdf" />
                                    : <FaFileWord className="file-icon docx" />;

                                return (
                                    <li
                                        key={index}
                                        className="file-row"
                                        onClick={() => handleFileDownload(file)}
                                    >
                                        <div className="file-left">
                                            {icon}
                                            <span className="file-name">{file.filename}</span>
                                        </div>
                                        <FaDownload className="download-icon" />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
