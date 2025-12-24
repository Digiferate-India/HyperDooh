// src/components/Topbar.jsx
import React from "react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b flex items-center px-6">
      {/* left: small icons area */}
      <div className="flex items-center gap-3 w-64">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded hover:bg-gray-100">☰</button>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <span className="text-xs">📁</span>
          <span>Dashboard</span>
          <span className="text-xs">/</span>
          <span className="font-medium text-gray-900">Nivedita</span>
        </div>
      </div>

      {/* center: search */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-lg">
          <div className="relative">
            <input
              placeholder="Search"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌘K</span>
          </div>
        </div>
      </div>

      {/* right: actions */}
      <div className="w-64 flex items-center justify-end gap-4">
        <button className="p-2 rounded hover:bg-gray-100">🌙</button>
        <button className="p-2 rounded hover:bg-gray-100">↻</button>
        <button className="p-2 rounded hover:bg-gray-100">🔔</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="hidden sm:block text-sm">Nivedita</div>
        </div>
      </div>
    </header>
  );
}
