import React from "react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./ResumeResults.css";

export default function ResumeResults(props) {
  const { score, summary, sections } = props.result || {};

  const formatLabel = (key) => {
    const labels = {
      technicalSkills: "Technical Skills Match",
      experience: "Job Experience Relevance",
      education: "Educational Background",
      projects: "Projects & Initiatives",
      communication: "Communication & Clarity"
    };
    return labels[key] || key;
  };

  console.log("Result data:", props.result);

  return (
    <motion.div
      className="results-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >

      <h1 className="results-title">Resume Analysis Results</h1>

      <div className="results-box">
        <p className="result-text">Your resume was analyzed successfully.</p>

        <div className="match-rate">
          <CircularProgressbar
            value={score || 0}
            text={`${score || 0}%`}
            styles={buildStyles({
              pathColor: score >= 75 ? '#22c55e' : score >= 50 ? '#facc15' : '#ef4444',
              textColor: 'white',
              trailColor: '#333',
            })}
          />
          <p className="match-label">Match Rate</p>
        </div>

        <div className="rubric-breakdown">
          {sections && Object.entries(sections).map(([key, val]) => (
            <div key={key} className="rubric-section">
              <h3>{formatLabel(key)}</h3>
              <p><strong>Score:</strong> {val.score}{val.outOf ? ` / ${val.outOf}` : ""}</p>
              <p>{val.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}