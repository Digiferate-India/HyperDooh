// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RightSidebar from "../components/RightSidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800">
      {/* Left sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content column (center) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Right rail (notifications) */}
      <RightSidebar />
    </div>
  );
}
