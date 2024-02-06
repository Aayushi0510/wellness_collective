// Layout.js

import React from 'react';
import Header from './Layout/Header';

function Wrapper({ children }) {
  return (
    <div>
      <Header />
      {children}
      {/* You can also include a footer component here if needed */}
    </div>
  );
}

export default Wrapper;
