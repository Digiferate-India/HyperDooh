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
        setIsLoading(true);

        // ✅ 1. Get the Current User
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No user logged in");
        }

        // ✅ 2. Fetch Screens & Media ONLY for this User
        // We fetch the screen IDs separately so we can use them to filter analytics
        const { data: userScreens, error: screenError, count: screenCount } = await supabase
          .from('screens')
          .select('id', { count: 'exact' }) // Get IDs and count
          .eq('user_id', user.id); // FILTER: Only current user's screens

        if (screenError) throw screenError;

        const { count: mediaCount, error: mediaError } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id); // FILTER: Only current user's media

        if (mediaError) throw mediaError;

        // Extract the list of Screen IDs belonging to this user
        const screenIds = userScreens.map(s => s.id);
        
        let audienceLogs = [];

        // ✅ 3. Fetch Audience Data ONLY for those Screen IDs
        // Only run this query if the user actually has screens
        if (screenIds.length > 0) {
          const { data: audienceResult, error: audienceError } = await supabase
            .from('audience_profiles')
            .select('*')
            .in('screen_id', screenIds) // FILTER: Check if screen_id is in our list
            .order('created_at', { ascending: true });
            
          if (audienceError) throw audienceError;
          audienceLogs = audienceResult || [];
        }

        // --- PROCESS DATA (Same logic as before) ---
        
        // 1. Calculate Totals
        const totalImpressions = audienceLogs.reduce((sum, row) => sum + (row.people_count || 0), 0);
        
        // Avg Age Logic
        const validAgeLogs = audienceLogs.filter(row => row.avg_age && row.avg_age > 0);
        const totalAvgAge = validAgeLogs.reduce((sum, row) => sum + row.avg_age, 0);
        const globalAvgAge = validAgeLogs.length > 0 ? Math.round(totalAvgAge / validAgeLogs.length) : 0;

        // 2. Gender Data
        const totalMales = audienceLogs.reduce((sum, row) => sum + (row.male_count || 0), 0);
        const totalFemales = audienceLogs.reduce((sum, row) => sum + (row.female_count || 0), 0);
        const processedGenderData = [
          { name: 'Male', value: totalMales },
          { name: 'Female', value: totalFemales },
        ];

        // 3. Age Data
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

        // 4. PROCESS TRAFFIC (Impressions by Date)
        const dailyMap = {};

        audienceLogs.forEach(log => {
          if (!log.created_at) return;
          
          const dateObj = new Date(log.created_at);
          const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = { 
              date: dateKey, 
              people: 0, 
              sortTime: dateObj.setHours(0,0,0,0) 
            };
          }
          dailyMap[dateKey].people += (log.people_count || 0);
        });

        const processedTrafficData = Object.values(dailyMap)
          .sort((a, b) => a.sortTime - b.sortTime);

        setStats({
          screens: screenCount || 0, // Use the count from the filtered query
          media: mediaCount || 0,    // Use the count from the filtered query
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Total Impressions" value={stats.impressions.toLocaleString()} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      {/* --- TRAFFIC CHART --- */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Impressions by Date</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="people" 
                name="Total People" 
                stroke="#8884d8" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg font-semibold mb-4">Age Demographics</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age_range" 
                  label={{ value: 'Age Groups (Years)', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" name="Audience Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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