// Create this file at: src/pages/dashboard/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// import Sidebar from '../../components/dashboard/Sidebar'; // You'll create this later

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;