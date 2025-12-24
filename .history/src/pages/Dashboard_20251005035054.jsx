// In src/pages/Dashboard.jsx
import StatCard from '../components/ui/StatCard';
import StatCard from '../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart. Later, we'll get this from Supabase.
const userData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 450 },
  { name: 'May', users: 600 },
  { name: 'Jun', users: 700 },
];

function Dashboard() {
  // Basic styling for the grid container
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  };

  return (
     <div>
      <h1>Dashboard Overview</h1>
      <div className="stats-container" style={gridStyle}>
        <StatCard title="Total Screens" value={4} />
        <StatCard title="Total Media" value={12} />
        <StatCard title="Total Schedules" value={8} />
        <StatCard title="Total Views" value="1.2M" />
      </div>
      
      <h2>User's Graph</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;