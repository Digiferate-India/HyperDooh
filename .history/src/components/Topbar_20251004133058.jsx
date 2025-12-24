// src/components/Topbar.jsx
import { Search, Bell, UserCircle } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <button
        className="md:hidden p-2 text-gray-600"
        onClick={onMenuClick}
      >
        ☰
      </button>
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-2 border rounded-md text-sm"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        </div>
        <Bell className="text-gray-600 cursor-pointer" />
        <UserCircle className="text-gray-600 cursor-pointer" />
      </div>
    </header>
  );
}
