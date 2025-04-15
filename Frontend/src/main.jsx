import React from 'react';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ResumeApp from './components/structural/ResumeApp.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

// CI/CD-2 tester

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResumeApp />
  </StrictMode>,
)
