// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Upload,
  PlaySquare,
  CreditCard,
  User,
  Building,
  BookOpen,
  Share2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pair Screen", icon: Monitor, path: "/dashboard/pair" },
  { label: "Assign Content", icon: PlaySquare, path: "/dashboard/assign" },
  { label: "Upload Media", icon: Upload, path: "/dashboard/upload" },
  { label: "Playback Screen", icon: PlaySquare, path: "/dashboard/playback" },
  { label: "My Plan", icon: CreditCard, path: "/dashboard/plan" },
  { label: "Account", icon: User, path: "/dashboard/account" },
  { label: "Corporate", icon: Building, path: "/dashboard/corporate" },
  { label: "Blog", icon: BookOpen, path: "/dashboard/blog" },
  { label: "Social", icon: Share2, path: "/dashboard/social" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform`}
    >
      <div className="p-4 font-bold text-xl border-b">Nivedita</div>
      <nav className="p-4 space-y-2">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
