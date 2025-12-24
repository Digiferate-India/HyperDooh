// In src/pages/Dashboard.jsx
import StatCard from '../components/ui/StatCard';
import StatCard from '../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      {/* Charts will go here next */}
    </div>
  );
}

export default Dashboard;