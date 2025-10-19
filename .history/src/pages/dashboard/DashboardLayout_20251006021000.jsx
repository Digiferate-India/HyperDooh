// In src/pages/dashboard/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar'; // Uncommented and path corrected

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar /> {/* Uncommented */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;