// In src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import StatCard from '../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../api/supabaseClient'; // Make sure you have this file

// We'll keep the sample userData for the chart for now
const userData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  // ... rest of the sample data
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch multiple counts at the same time
        const { count: screenCount, error: screenError } = await supabase.from('screens').select('*', { count: 'exact', head: true });
        if(screenError) throw screenError;
        
        const { count: mediaCount, error: mediaError } = await supabase.from('media').select('*', { count: 'exact', head: true });
        if(mediaError) throw mediaError;

        setStats({
          screens: screenCount,
          media: mediaCount,
          schedules: 8, // Placeholder
          views: '1.2M'   // Placeholder
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []); // Empty array means this runs only once

  const gridStyle = {
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
        <StatCard title="Total Schedules" value={stats.schedules} />
        <StatCard title="Total Views" value={stats.views} />
      </div>

      <h2>User's Graph</h2>
      {/* The chart still uses static data for now */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={userData}>
            {/* ... rest of the chart components */}
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;