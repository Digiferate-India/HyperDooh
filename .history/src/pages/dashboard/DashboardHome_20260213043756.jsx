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
  
  // Data for the Table
  const [recentFaces, setRecentFaces] = useState([]); 

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        setIsLoading(true);

        // ✅ 1. Get the Current User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user logged in");

        // ✅ 2. Get User's Screens
        const { data: userScreens, error: screenError, count: screenCount } = await supabase
          .from('screens')
          .select('id', { count: 'exact' }) 
          .eq('user_id', user.id); 

        if (screenError) throw screenError;

        // Get Media Count
        const { count: mediaCount, error: mediaError } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id); 

        if (mediaError) throw mediaError;

        const screenIds = userScreens.map(s => s.id);
        
        // Define variables for data
        let audienceLogs = []; // For Traffic (Profiles)
        let allFaces = [];     // For Age/Gender (Faces)

        if (screenIds.length > 0) {
          // A. Fetch PROFILES (Summary data for Traffic Chart)
          const { data: profileResult, error: profileError } = await supabase
            .from('audience_profiles')
            .select('*')
            .in('screen_id', screenIds)
            .order('created_at', { ascending: true });
            
          if (profileError) throw profileError;
          audienceLogs = profileResult || [];

          // B. Fetch FACES (Granular data for Age/Gender Charts & Table)
          // We join with audience_profiles to ensure we filter by YOUR screens
          const { data: facesResult, error: facesError } = await supabase
            .from('audience_faces')
            .select(`
              *,
              audience_profiles!inner ( screen_id )
            `)
            .in('audience_profiles.screen_id', screenIds)
            .order('created_at', { ascending: false }); // Newest first

          if (facesError) throw facesError;
          allFaces = facesResult || [];
        }

        // --- PROCESS DATA ---

        // 1. Traffic Trends (Line Chart) -> Uses PROFILES
        // Group by Hour
        const trafficMap = {};
        audienceLogs.forEach(log => {
          if (!log.created_at) return;
          const dateObj = new Date(log.created_at);
          
          // Key: "Feb 2, 10 AM"
          const groupKey = dateObj.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: 'numeric', hour12: true 
          });
          const timeLabel = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

          if (!trafficMap[groupKey]) {
            trafficMap[groupKey] = { 
              fullLabel: groupKey, 
              date: timeLabel, 
              people: 0, 
              sortTime: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours()).getTime()
            };
          }
          trafficMap[groupKey].people += (log.people_count || 0);
        });

        const processedTrafficData = Object.values(trafficMap).sort((a, b) => a.sortTime - b.sortTime);

        // 2. Age Demographics (Bar Chart) -> Uses FACES
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        let totalFaceAge = 0;
        let validFaceCount = 0;

        allFaces.forEach(face => {
            const age = Math.round(face.age);
            
            // Calculate avg age for stats
            if (age > 0) {
                totalFaceAge += age;
                validFaceCount++;
            }

            // Bucketing
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

        // 3. Gender Split (Pie Chart) -> Uses FACES
        let maleCount = 0;
        let femaleCount = 0;

        allFaces.forEach(face => {
            const g = (face.gender || '').toLowerCase();
            if (g === 'male') maleCount++;
            else if (g === 'female') femaleCount++;
        });

        const processedGenderData = [
          { name: 'Male', value: maleCount },
          { name: 'Female', value: femaleCount },
        ];

        // 4. Stats & Table
        
        // ✅ CHANGED: Now correctly filtering for only NEW faces for impressions
        const totalImpressions = allFaces.filter(face => face.is_new).length;
        
        const avgAge = validFaceCount > 0 ? Math.round(totalFaceAge / validFaceCount) : 0;

        setStats({
          screens: screenCount || 0,
          media: mediaCount || 0,
          impressions: totalImpressions,
          avgAge: avgAge
        });
        
        setTrafficData(processedTrafficData);
        setAgeData(processedAgeData);
        setGenderData(processedGenderData);
        setRecentFaces(allFaces.slice(0, 20)); // Take top 20 for the table

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
        <h2 className="text-lg font-semibold mb-4">Impressions Over Time</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" /> 
              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={(label, payload) => payload && payload.length > 0 ? payload[0].payload.fullLabel : label} />
              <Legend />
              <Line type="monotone" dataKey="people" name="Total People" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Age Chart */}
        <div className="bg-white p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg font-semibold mb-4">Age Demographics</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" label={{ value: 'Age Groups (Years)', position: 'insideBottom', offset: -10 }} />
                <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" name="Audience Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="bg-white p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={genderData} cx="50%" cy="50%" labelLine={true} outerRadius={70} fill="#8884d8" dataKey="value" nameKey="name"
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

      {/* --- AUDIENCE DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Audience Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dwell Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentFaces.length > 0 ? (
                recentFaces.map((face) => (
                  <tr key={face.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(face.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(face.age)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {face.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {face.dwell_time_sec ? face.dwell_time_sec + 's' : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent audience data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;