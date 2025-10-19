// src/pages/PairScreen.jsx
import DashboardLayout from "../layouts/DashboardLayout";

export default function PairScreen() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold mb-6">Overview</h1>

      <div className="p-4 bg-indigo-50 rounded-lg mb-6">
        <button className="px-4 py-2 bg-indigo-700 text-white rounded-md">Pair</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Area" className="border p-2 rounded-md" defaultValue="Jhalalli, Sector 6" />
        <input type="text" placeholder="City" className="border p-2 rounded-md" defaultValue="Delhi" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Custom Name" className="border p-2 rounded-md" defaultValue="Screen 9" />
        <button className="px-4 py-2 bg-indigo-700 text-white rounded-md">Save</button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Screens</h2>
      <ul className="space-y-2">
        <li className="flex justify-between items-center border p-2 rounded-md">Screen A <button className="text-red-500">Unpair</button></li>
        <li className="flex justify-between items-center border p-2 rounded-md">Screen B <button className="text-red-500">Unpair</button></li>
        <li className="flex justify-between items-center border p-2 rounded-md">Screen C <button className="text-red-500">Unpair</button></li>
      </ul>
    </DashboardLayout>
  );
}
