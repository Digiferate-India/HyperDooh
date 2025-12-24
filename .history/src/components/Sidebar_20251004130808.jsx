// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { name: "Dashboard", to: "/dashboard", icon: "📊" },
  { name: "Pair Screen", to: "/pair-screen", icon: "📺" },
  { name: "Assign Content", to: "/assign", icon: "🔗" },
  { name: "Upload Media", to: "/media", icon: "🖼️" },
  { name: "Playback Screen", to: "/player", icon: "▶️" },
  { name: "My Plan", to: "/plan", icon: "🧾" },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const location = useLocation();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r py-6 flex-col px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-sky-400 rounded-full" />
          <div>
            <div className="text-sm font-semibold">Nivedita</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                  active ? "bg-gray-100 text-indigo-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-4 border-t text-sm text-gray-600">
          <div className="py-2">Account</div>
          <div className="py-2">Corporate</div>
          <div className="py-2">Blog</div>
          <div className="py-2">Social</div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-72 bg-white h-full p-4">
          <button onClick={onClose} className="mb-6 text-gray-600">Close</button>
          <nav className="space-y-2">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
