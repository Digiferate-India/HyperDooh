// src/components/RightSidebar.jsx
import React from "react";

export default function RightSidebar() {
  const notifications = [
    { text: "You fixed a bug.", time: "Just now" },
    { text: "New user registered.", time: "59 minutes ago" },
    { text: "You fixed a bug.", time: "12 hours ago" },
  ];

  const activities = [
    { text: "Changed the style.", time: "Just now" },
    { text: "Released a new version.", time: "59 minutes ago" },
    { text: "Submitted a bug.", time: "12 hours ago" },
  ];

  const contacts = ["Natali Craig", "Drew Cano", "Andi Lane", "Koray Okumus", "Kate Morrison"];

  return (
    <aside className="hidden xl:flex flex-col w-80 border-l bg-white p-6 overflow-auto">
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Notifications</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          {notifications.map((n, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">🔔</div>
              <div>
                <div className="font-medium">{n.text}</div>
                <div className="text-xs text-gray-400">{n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Activities</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          {activities.map((a, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-yellow-300" />
              <div>
                <div className="text-sm">{a.text}</div>
                <div className="text-xs text-gray-400">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Contacts</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {contacts.map((c) => (
            <li key={c} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>{c}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
