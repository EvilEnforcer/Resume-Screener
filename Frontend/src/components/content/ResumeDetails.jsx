import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import "./ResumeDetails.css";

export default function ResumeDetails(props) {
    const jobTitleRef = useRef();
    const jobDescriptionRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e?.preventDefault();

        setLoading(true);
        setErrorMessage("");


        if (jobTitleRef.current.value == "" || jobDescriptionRef.current.value == "") {
            setErrorMessage("Please enter data in both fields")
            setLoading(false);
            return
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/document/analyze/${props.fileid}`, {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jobTitle": jobTitleRef.current.value,
                "jobDescription": jobDescriptionRef.current.value
            })
        })
            .then(async res => {
                const data = await res.json();
                console.log("Full response from backend:", data);
                if (res.status === 200) {
                    console.log("Analyzing success:", data);
                    props.setResults(data.score, data.summary, data.sections);
                    setLoading(false);
                    navigate("/results");
                } else {
                    console.error("Backend error response:", data);
                    setErrorMessage(data.message);
                    setLoading(false);
                    throw new Error(data.message);
                }
            })
            .catch(err => {
                console.error("Analyze failed:", err.message);
                setLoading(false);
            });

    }

    return (
        <motion.div
            className="details-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >

            <h1 className="details-title">Job Details</h1>

            <div className="input-group">
                <label htmlFor="job-title">Job Title</label>
                <input
                    id="job-title"
                    className="text-input"
                    type="text"
                    placeholder="e.g., Software Engineer III"
                    ref={jobTitleRef}
                />
            </div>

            <div className="input-group">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                    id="job-description"
                    className="textarea-input"
                    placeholder="Paste or write the job description here..."
                    rows={6}
                    ref={jobDescriptionRef}
                />
            </div>

            {errorMessage && <p className="details-error-message">{errorMessage}</p>}

            {!loading && <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>}

            {loading && !errorMessage && (
                <div className="upload-status">
                    <p className="loading-text">Analyzing your resume...</p>
                </div>
            )}
        </motion.div>
    );
}
