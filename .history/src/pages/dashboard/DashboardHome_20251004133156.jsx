// src/pages/dashboard/DashboardHome.jsx
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

const ageData = [
  { name: "<18", value: 10000 },
  { name: "18-25", value: 20000 },
  { name: "26-35", value: 30000 },
  { name: "36-45", value: 25000 },
  { name: "46-60", value: 15000 },
  { name: "60+", value: 18000 },
];

const genderData = [
  { name: "Male", value: 52.1 },
  { name: "Female", value: 22.8 },
  { name: "Other", value: 11.2 },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Screens</h3>
          <p className="text-2xl font-bold">7</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Media</h3>
          <p className="text-2xl font-bold">36</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Schedules</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Views</h3>
          <p className="text-2xl font-bold">2,318</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData}>
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Gender Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80}>
                <Cell fill="#3b82f6" />
                <Cell fill="#f43f5e" />
                <Cell fill="#10b981" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
