// In src/pages/dashboard/DashboardHome.jsx
import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [dailyUsersData, setDailyUsersData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const [screenResult, mediaResult, dailyUsersResult, ageResult, genderResult] = await Promise.all([
          supabase.from('screens').select('*', { count: 'exact', head: true }),
          supabase.from('media').select('*', { count: 'exact', head: true }),
          supabase.from('daily_users').select('*').order('date', { ascending: true }),
          supabase.from('age_distribution').select('*'),
          supabase.from('gender_distribution').select('*')
        ]);

        if (screenResult.error) throw screenResult.error;
        if (mediaResult.error) throw mediaResult.error;
        if (dailyUsersResult.error) throw dailyUsersResult.error;
        if (ageResult.error) throw ageResult.error;
        if (genderResult.error) throw genderResult.error;

        setStats({ screens: screenResult.count, media: mediaResult.count });
        setDailyUsersData(dailyUsersResult.data);
        setAgeData(ageResult.data);
        setGenderData(genderResult.data);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats?.screens ?? 0} />
        <StatCard title="Media" value={stats?.media ?? 0} />
        <StatCard title="Schedules" value={156} />
        <StatCard title="Views" value={"2,318"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Users</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={dailyUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="user_count" name="Users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="count" nameKey="gender">
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