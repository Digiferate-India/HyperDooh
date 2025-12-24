// src/components/Sidebar.jsx
import { Home, Monitor, Upload, Play, Settings, Briefcase, FileText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Pair Screen", icon: Monitor, path: "/pair-screen" },
  { name: "Assign Content", icon: FileText, path: "/assign-content" },
  { name: "Upload Media", icon: Upload, path: "/upload-media" },
  { name: "Playback Screen", icon: Play, path: "/playback" },
  { name: "My Plan", icon: Briefcase, path: "/plan" },
  { name: "Account", icon: Settings, path: "/account" },
  { name: "Corporate", icon: Users, path: "/corporate" },
  { name: "Blog", icon: FileText, path: "/blog" },
  { name: "Social", icon: Users, path: "/social" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col p-4">
      <div className="text-xl font-bold mb-8">Nivedita</div>
      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                isActive ? "bg-gray-200 text-gray-900" : "text-gray-600"
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
