import React from 'react';
import { useParams } from 'react-router-dom';

function SpeedMatch() {
  // Access the userId parameter from the URL
  let { userId } = useParams();

  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {userId}</p>
      
      <button>Click</button>
      {/* Fetch user data using userId and render the profile */}
    </div>
  );
}

export default SpeedMatch;



