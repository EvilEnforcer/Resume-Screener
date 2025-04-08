import React from "react"
import { motion } from "framer-motion";

function ResumeAppHome (props) {
    return <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
        <h1>Welcome to Resume Screener!</h1>
        <p>This website is under construction</p>
        <button onClick={props.logout}>Logout</button>
    </motion.div>
}

export default ResumeAppHome;