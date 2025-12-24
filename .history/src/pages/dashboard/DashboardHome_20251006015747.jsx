// In src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabaseClient';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        // Fetch stats and chart data at the same time
        const [screenResult, mediaResult, chartResult] = await Promise.all([
          supabase.from('screens').select('*', { count: 'exact', head: true }),
          supabase.from('media').select('*', { count: 'exact', head: true }),
          // supabase.from('daily_users').select('date, user_count').order('date') // Example table
        ]);

        if (screenResult.error) throw screenResult.error;
        if (mediaResult.error) throw mediaResult.error;
        if (chartResult.error) throw chartResult.error;

        setStats({ screens: screenResult.count, media: mediaResult.count });
        setChartData(chartResult.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, []);

  const gridStyle = { /* ... same as before ... */ 
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  };
  
  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard Overview</h1>
      <div className="stats-container" style={gridStyle}>
        <StatCard title="Total Screens" value={stats.screens} />
        <StatCard title="Total Media" value={stats.media} />
        {/* ... other stats */}
      </div>

      <h2>User's Graph</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="user_count" name="Users" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;