import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const COLORS = ['#0088FE', '#FF8042']; // Blue for Male, Orange/Pink for Female

function DashboardHome() {
  const [stats, setStats] = useState({ screens: 0, media: 0, impressions: 0, avgAge: 0 });
  const [trafficData, setTrafficData] = useState([]); // For Line Chart
  const [ageData, setAgeData] = useState([]);         // For Bar Chart
  const [genderData, setGenderData] = useState([]);   // For Pie Chart
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        // 1. Fetch all necessary tables in parallel
        const [screenResult, mediaResult, audienceResult] = await Promise.all([
          supabase.from('screens').select('*', { count: 'exact', head: true }),
          supabase.from('media').select('*', { count: 'exact', head: true }),
          // Fetch raw audience data to calculate stats locally
          supabase.from('audience_profiles').select('*').order('id', { ascending: true }) 
        ]);

        if (screenResult.error) throw screenResult.error;
        if (mediaResult.error) throw mediaResult.error;
        if (audienceResult.error) throw audienceResult.error;

        const audienceLogs = audienceResult.data || [];

        // --- PROCESS DATA ---

        // 1. Calculate Totals (Cards)
        const totalImpressions = audienceLogs.reduce((sum, row) => sum + (row.people_count || 0), 0);
        
        // Calculate Average Age (exclude nulls/zeros)
        const validAgeLogs = audienceLogs.filter(row => row.avg_age && row.avg_age > 0);
        const totalAvgAge = validAgeLogs.reduce((sum, row) => sum + row.avg_age, 0);
        const globalAvgAge = validAgeLogs.length > 0 ? Math.round(totalAvgAge / validAgeLogs.length) : 0;

        // 2. Prepare Gender Data (Pie Chart)
        const totalMales = audienceLogs.reduce((sum, row) => sum + (row.male_count || 0), 0);
        const totalFemales = audienceLogs.reduce((sum, row) => sum + (row.female_count || 0), 0);
        
        const processedGenderData = [
          { name: 'Male', value: totalMales },
          { name: 'Female', value: totalFemales },
        ];

        // 3. Prepare Age Distribution (Bar Chart)
        // We will bucket the 'avg_age' from each log into groups
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        
        validAgeLogs.forEach(log => {
          const age = Math.floor(log.avg_age);
          if (age <= 18) ageBuckets['1-18']++;
          else if (age <= 25) ageBuckets['19-25']++;
          else if (age <= 35) ageBuckets['26-35']++;
          else if (age <= 50) ageBuckets['36-50']++;
          else ageBuckets['51+']++;
        });

        const processedAgeData = Object.keys(ageBuckets).map(range => ({
          age_range: range,
          count: ageBuckets[range]
        }));

        // 4. Prepare Traffic Data (Line Chart)
        // We use the ID or row index to simulate time flow if created_at isn't available
        const processedTrafficData = audienceLogs.map((log, index) => ({
          id: log.id,
          event_index: index + 1,
          people: log.people_count
        }));

        // --- SET STATE ---
        setStats({
          screens: screenResult.count,
          media: mediaResult.count,
          impressions: totalImpressions,
          avgAge: globalAvgAge
        });
        setTrafficData(processedTrafficData);
        setAgeData(processedAgeData);
        setGenderData(processedGenderData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getDashboardData();
  }, []);

  if (isLoading) return <div className="p-6">Loading analytics...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        {/* Replaced Schedules with Impressions */}
        <StatCard title="Total Impressions" value={stats.impressions.toLocaleString()} />
        {/* Replaced Views with Avg Age */}
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      {/* --- GRAPHS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Traffic Line Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Traffic (People Count per Event)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event_index" label={{ value: 'Event Sequence', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'People', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="people" name="People Count" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Age Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Age Demographics</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Audience Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Gender Split Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={genderData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value" 
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
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