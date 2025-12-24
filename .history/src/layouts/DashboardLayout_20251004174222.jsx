// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RightSidebar from "../components/RightSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
      </div>
      <RightSidebar />
    </div>
  );
}
