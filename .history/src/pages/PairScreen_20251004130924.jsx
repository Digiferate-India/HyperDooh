// src/pages/PairScreen.jsx
import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function PairScreen() {
  const [area, setArea] = useState("Jalahalli, Sector 6");
  const [city, setCity] = useState("Delhi");
  const [customName, setCustomName] = useState("Screen 9");
  const [screens] = useState(["Screen A", "Screen B", "Screen C"]);
  const [selected, setSelected] = useState(0);

  const onPair = () => {
    // show modal or call supabase to create new screen + pair code
    alert("Pair flow started — display pair code on device / create record in DB");
  };

  const onSaveField = (field) => {
    alert(`${field} saved`);
  };

  const onUnpair = () => {
    alert("Unpaired selected screen");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1">Dashboard / <span className="text-gray-900 font-medium">Pair Screen</span></div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <div className="text-sm text-gray-500">Today ▾</div>
        </div>
      </div>

      {/* Pair card */}
      <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">Pair New Screen</div>
          <button onClick={onPair} className="bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-sm">Pair</button>
        </div>
        <div className="text-sm text-gray-500 mt-2">Create a new device pairing code and show it on the screen to link quickly.</div>
      </div>

      {/* Form area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Area</label>
          <div className="flex items-center gap-3">
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none"
            />
            <button onClick={() => onSaveField("Area")} className="bg-indigo-900 text-white px-4 py-2 rounded-md">SAVE</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">City</label>
          <div className="flex items-center gap-3">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none"
            />
            <button onClick={() => onSaveField("City")} className="bg-indigo-900 text-white px-4 py-2 rounded-md">SAVE</button>
          </div>
        </div>
      </div>

      <div className="mb-8 max-w-lg">
        <label className="block text-sm text-gray-700 mb-2">Custom Name</label>
        <div className="flex items-center gap-3">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none"
          />
          <button onClick={() => onSaveField("Custom Name")} className="bg-indigo-900 text-white px-4 py-2 rounded-md">SAVE</button>
        </div>
      </div>

      {/* Screen list + unpair */}
      <div className="max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-700">Screen</div>
          <button onClick={onUnpair} className="bg-indigo-900 text-white px-4 py-2 rounded-lg">Unpair</button>
        </div>

        <div className="border rounded-md divide-y">
          {screens.map((s, i) => (
            <div
              key={s}
              onClick={() => setSelected(i)}
              className={`px-4 py-3 cursor-pointer flex items-center justify-between ${selected === i ? "bg-indigo-50" : ""}`}
            >
              <div className="text-sm text-gray-800">{s}</div>
              <div className="text-xs text-gray-400">▾</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
