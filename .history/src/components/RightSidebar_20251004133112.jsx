// src/components/RightSidebar.jsx
export default function RightSidebar() {
  return (
    <aside className="hidden lg:block w-72 border-l bg-white overflow-y-auto">
      <div className="p-4 border-b font-bold">Notifications</div>
      <ul className="p-4 space-y-3 text-sm">
        <li>You fixed a bug. <span className="text-gray-400">Just now</span></li>
        <li>New user registered. <span className="text-gray-400">59m ago</span></li>
        <li>Andi Lane subscribed. <span className="text-gray-400">11:59am</span></li>
      </ul>

      <div className="p-4 border-b font-bold">Activities</div>
      <ul className="p-4 space-y-3 text-sm">
        <li>The Screen 2 is Paired <span className="text-gray-400">1m ago</span></li>
        <li>The Content 1 is Playing <span className="text-gray-400">52m ago</span></li>
        <li>Modified A data in Project X <span className="text-gray-400">11:59am</span></li>
      </ul>

      <div className="p-4 border-b font-bold">Contacts</div>
      <ul className="p-4 space-y-3 text-sm">
        <li>👤 Natali Craig</li>
        <li>👤 Drew Cano</li>
        <li>👤 Andi Lane</li>
        <li>👤 Koray Okumus</li>
      </ul>
    </aside>
  );
}
