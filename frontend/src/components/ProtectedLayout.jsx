// src/components/ProtectedLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const ProtectedLayout = () => {
  return (
    <div>
      <NavBar />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;