// src/components/RightSidebar.jsx
export default function RightSidebar() {
  return (
    <aside className="w-72 bg-white border-l h-screen p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-3 mb-6">
        <p className="text-sm">✅ You fixed a bug. <span className="text-gray-400">Just now</span></p>
        <p className="text-sm">🆕 New user registered. <span className="text-gray-400">59 mins ago</span></p>
        <p className="text-sm">📌 You fixed a bug. <span className="text-gray-400">12 hours ago</span></p>
      </div>

      <h2 className="text-lg font-semibold mb-4">Activities</h2>
      <div className="space-y-3 mb-6">
        <p className="text-sm">🎨 Changed the style. <span className="text-gray-400">Just now</span></p>
        <p className="text-sm">🚀 Released a new version. <span className="text-gray-400">59 mins ago</span></p>
      </div>

      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      <div className="flex flex-col gap-2">
        {["Natali Craig", "Drew Cano", "Andi Lane", "Koray Okumus", "Kate Morrison"].map((name) => (
          <div key={name} className="flex items-center gap-2">
            <img src={`https://ui-avatars.com/api/?name=${name}`} alt={name} className="w-6 h-6 rounded-full" />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
