// src/components/Topbar.jsx
import { Bell, Search, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-3">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        Dashboard / <span className="text-gray-900 font-medium">Nivedita</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1 border rounded-md text-sm"
          />
          <Search className="absolute left-2 top-1.5 text-gray-400" size={16} />
        </div>
        <Settings size={18} className="text-gray-600 cursor-pointer" />
        <Bell size={18} className="text-gray-600 cursor-pointer" />
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
