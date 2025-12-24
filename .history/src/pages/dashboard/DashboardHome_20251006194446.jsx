// In src/pages/dashboard/DashboardHome.jsx
import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabaseClient'; // Make sure this path is correct

// --- Sample Data (we'll replace this with real data later) ---
const totalUsersData = [
  { name: 'Jan', users: 12000 }, { name: 'Feb', users: 19000 },
  { name: 'Mar', users: 15000 }, { name: 'Apr', users: 21000 },
  { name: 'May', users: 25000 }, { name: 'Jun', users: 23000 },
  { name: 'Jul', users: 28000 },
];
const ageData = [
  { name: '<18', value: 21000 }, { name: '18-25', value: 32000 },
  { name: '26-35', value: 22000 }, { name: '36-45', value: 31000 },
  { name: '46-60', value: 18000 }, { name: '60+', value: 24000 },
];
const genderData = [
  { name: 'Male', value: 52.1 },
  { name: 'Female', value: 22.8 },
  { name: 'Other', value: 11.2 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
// --- End Sample Data ---

function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const [screenResult, mediaResult] = await Promise.all([
          supabase.from('screens').select('*', { count: 'exact', head: true }),
          supabase.from('media').select('*', { count: 'exact', head: true }),
        ]);
        if (screenResult.error) throw screenResult.error;
        if (mediaResult.error) throw mediaResult.error;
        setStats({ screens: screenResult.count, media: mediaResult.count });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, []);

  if (isLoading) return <div className="p-6">Loading dashboard data...</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        {/* You can add a date dropdown here later */}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats?.screens ?? 0} />
        <StatCard title="Media" value={stats?.media ?? 0} />
        <StatCard title="Schedules" value={156} />
        <StatCard title="Views" value={"2,318"} />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Users Chart (Takes up 2/3 width on large screens) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Users</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={totalUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Split Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                  {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;