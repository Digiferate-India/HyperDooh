// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
