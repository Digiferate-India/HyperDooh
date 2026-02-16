import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const COLORS = ['#0088FE', '#FF8042'];

function DashboardHome() {
  const [stats, setStats] = useState({ screens: 0, media: 0, impressions: 0, avgAge: 0 });
  const [trafficData, setTrafficData] = useState([]); 
  const [ageData, setAgeData] = useState([]);         
  const [genderData, setGenderData] = useState([]);   
  const [recentFaces, setRecentFaces] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user logged in");

        // 1. Get User's Screens
        const { data: userScreens, error: screenError, count: screenCount } = await supabase
          .from('screens')
          .select('id', { count: 'exact' }) 
          .eq('user_id', user.id); 

        if (screenError) throw screenError;

        // 2. Get Media Count
        const { count: mediaCount, error: mediaError } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id); 

        if (mediaError) throw mediaError;

        const screenIds = userScreens.map(s => s.id);
        let allFaces = [];
        let audienceLogs = [];

        if (screenIds.length > 0) {
          // A. Fetch PROFILES (This feeds the Line Graph)
          const { data: profileResult, error: profileError } = await supabase
            .from('audience_profiles')
            .select('*')
            .in('screen_id', screenIds)
            .order('created_at', { ascending: true });
            
          if (profileError) throw profileError;
          audienceLogs = profileResult || [];

          // B. Fetch FACES (Demographics & Recent Table)
          const { data: facesResult, error: facesError } = await supabase
            .from('audience_faces')
            .select(`*, audience_profiles(screen_id)`) 
            .order('created_at', { ascending: false })
            .limit(1000); 

          if (facesError) throw facesError;
          allFaces = facesResult || [];
        }

        // --- 📊 PROCESS TRAFFIC DATA (FIX FOR GRAPH) ---
        const trafficMap = {};
        audienceLogs.forEach(log => {
          const dateObj = new Date(log.created_at);
          // Group by hour or specific timestamp for the X-Axis
          const timeLabel = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          
          if (!trafficMap[timeLabel]) {
            trafficMap[timeLabel] = { date: timeLabel, people: 0 };
          }
          trafficMap[timeLabel].people += (log.people_count || 0);
        });
        
        // Ensure data is sorted for the Line Chart
        const formattedTraffic = Object.values(trafficMap);
        setTrafficData(formattedTraffic);

        // --- 📊 PROCESS UNIQUE PERSONS (DEMOGRAPHICS) ---
        const uniquePersonsSeen = new Set(); 
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        let totalFaceAge = 0;
        let validFaceCount = 0;
        let maleCount = 0;
        let femaleCount = 0;

        allFaces.forEach(face => {
            const uniqueId = face.person_id || face.face_external_id || face.id;
            if (uniquePersonsSeen.has(uniqueId)) return;
            uniquePersonsSeen.add(uniqueId);

            const g = (face.gender || '').toLowerCase();
            if (g === 'male') maleCount++;
            else if (g === 'female') femaleCount++;

            const age = Math.round(face.age);
            if (age > 0) { 
                totalFaceAge += age; 
                validFaceCount++; 
                if (age <= 18) ageBuckets['1-18']++;
                else if (age <= 25) ageBuckets['19-25']++;
                else if (age <= 35) ageBuckets['26-35']++;
                else if (age <= 50) ageBuckets['36-50']++;
                else ageBuckets['51+']++;
            }
        });

        setAgeData(Object.keys(ageBuckets).map(range => ({ age_range: range, count: ageBuckets[range] })));
        setGenderData([{ name: 'Male', value: maleCount }, { name: 'Female', value: femaleCount }]);
        
        setStats({
          screens: screenCount || 0,
          media: mediaCount || 0,
          impressions: allFaces.length, // Matching your DB total (981)
          avgAge: validFaceCount > 0 ? Math.round(totalFaceAge / validFaceCount) : 0
        });

        setRecentFaces(allFaces.slice(0, 20)); 

      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, []);

  if (isLoading) return <div className="p-6">Loading Analytics...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Total Impressions" value={stats.impressions} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      {/* Traffic Pattern Graph */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Impressions Over Time</h2>
        <div style={{ width: '100%', height: 300 }}>
          {trafficData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" /> 
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="people" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 border-2 border-dashed rounded">
              No traffic data available for grouped screen IDs
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Age Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Age Demographics</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label>
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