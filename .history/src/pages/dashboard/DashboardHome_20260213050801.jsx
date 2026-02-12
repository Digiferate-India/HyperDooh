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

        // Get Media Count
        const { count: mediaCount, error: mediaError } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id); 

        if (mediaError) throw mediaError;

        const screenIds = userScreens.map(s => s.id);
        let allFaces = [];

        if (screenIds.length > 0) {
          // 🧪 DEBUG STEP: Checking if female records exist at all (ignoring joins/filters)
          const { data: debugResult, error: debugError } = await supabase
            .from('audience_faces')
            .select('*')
            .eq('gender', 'female')
            .limit(10);

          if (debugError) console.error("Debug Query Error:", debugError);
          console.log("Debug - Raw Female records found in DB:", debugResult);

          // Standard Fetch (Back to normal logic but with the 1000 limit)
          const { data: facesResult, error: facesError } = await supabase
            .from('audience_faces')
            .select(`
              *,
              audience_profiles!inner ( screen_id )
            `)
            .in('audience_profiles.screen_id', screenIds)
            .order('created_at', { ascending: false })
            .limit(1000); 

          if (facesError) throw facesError;
          allFaces = facesResult || [];
        }

        // --- PROCESS DATA ---
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        let totalFaceAge = 0;
        let validFaceCount = 0;
        let maleCount = 0;
        let femaleCount = 0;

        allFaces.forEach(face => {
            if (!face.is_new) return;

            const g = (face.gender || '').toLowerCase();
            if (g === 'male') maleCount++;
            else if (g === 'female') femaleCount++;

            const age = Math.round(face.age);
            if (age > 0) {
                totalFaceAge += age;
                validFaceCount++;
            }

            if (age <= 18) ageBuckets['1-18']++;
            else if (age <= 25) ageBuckets['19-25']++;
            else if (age <= 35) ageBuckets['26-35']++;
            else if (age <= 50) ageBuckets['36-50']++;
            else ageBuckets['51+']++;
        });

        // Update States
        setGenderData([
          { name: 'Male', value: maleCount },
          { name: 'Female', value: femaleCount },
        ]);
        
        setAgeData(Object.keys(ageBuckets).map(range => ({
          age_range: range,
          count: ageBuckets[range]
        })));

        setStats(prev => ({
          ...prev,
          screens: screenCount || 0,
          media: mediaCount || 0,
          impressions: allFaces.filter(f => f.is_new).length,
          avgAge: validFaceCount > 0 ? Math.round(totalFaceAge / validFaceCount) : 0
        }));
        
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

  if (isLoading) return <div className="p-6">Loading analytics...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h1>
      
      {/* Cards & Charts would follow here as per your original UI structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Total Impressions" value={stats.impressions} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={genderData} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value" nameKey="name"
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
  );
}

export default DashboardHome;