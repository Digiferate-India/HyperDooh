import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const COLORS = ['#0088FE', '#FF8042']; // Blue for Male, Orange for Female

function DashboardHome() {
  const [stats, setStats] = useState({ screens: 0, media: 0, impressions: 0, avgAge: 0 });
  const [trafficData, setTrafficData] = useState([]); 
  const [ageData, setAgeData] = useState([]);         
  const [genderData, setGenderData] = useState([]);   
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const [screenResult, mediaResult, audienceResult] = await Promise.all([
          supabase.from('screens').select('*', { count: 'exact', head: true }),
          supabase.from('media').select('*', { count: 'exact', head: true }),
          supabase.from('audience_profiles').select('*').order('id', { ascending: true }) 
        ]);

        if (screenResult.error) throw screenResult.error;
        if (mediaResult.error) throw mediaResult.error;
        if (audienceResult.error) throw audienceResult.error;

        const audienceLogs = audienceResult.data || [];

        // --- PROCESS DATA ---
        const totalImpressions = audienceLogs.reduce((sum, row) => sum + (row.people_count || 0), 0);
        
        const validAgeLogs = audienceLogs.filter(row => row.avg_age && row.avg_age > 0);
        const totalAvgAge = validAgeLogs.reduce((sum, row) => sum + row.avg_age, 0);
        const globalAvgAge = validAgeLogs.length > 0 ? Math.round(totalAvgAge / validAgeLogs.length) : 0;

        const totalMales = audienceLogs.reduce((sum, row) => sum + (row.male_count || 0), 0);
        const totalFemales = audienceLogs.reduce((sum, row) => sum + (row.female_count || 0), 0);
        
        const processedGenderData = [
          { name: 'Male', value: totalMales },
          { name: 'Female', value: totalFemales },
        ];

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

        const processedTrafficData = audienceLogs.map((log, index) => ({
          id: log.id,
          event_index: index + 1,
          people: log.people_count
        }));

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
    <div className="p-6 bg-gray-50 min-h-full overflow-x-hidden">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h1>

      {/* --- TOP STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Total Impressions" value={stats.impressions.toLocaleString()} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      {/* --- TRAFFIC CHART (Full Width) --- */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Traffic (People Count per Event)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event_index" label={{ value: 'Event Sequence', position: 'insideBottomRight', offset: -5 }} />
              <YAxis allowDecimals={false} label={{ value: 'People', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="people" name="People Count" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- BOTTOM ROW (50/50 Split for Age & Gender) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AGE CHART */}
        <div className="bg-white p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg font-semibold mb-4">Age Demographics</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData} margin={{ bottom: 20 }}> {/* Added margin for the label */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age_range" 
                  // ✅ ADDED LABEL HERE
                  label={{ value: 'Age Groups (Years)', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" name="Audience Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GENDER CHART */}
        <div className="bg-white p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={genderData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={true} 
                  // ✅ REDUCED RADIUS to prevent cutting off
                  outerRadius={70} 
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
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;