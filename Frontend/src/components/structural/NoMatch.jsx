// pages/NoMatch.js
import React from 'react';
import { Link } from 'react-router-dom';

function NoMatch() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default NoMatch;
