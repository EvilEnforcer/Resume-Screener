import React from 'react';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ResumeApp from './components/structural/ResumeApp.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResumeApp />
  </StrictMode>,
)
