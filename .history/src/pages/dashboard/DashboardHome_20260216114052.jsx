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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user logged in");

        // Fetch Screen and Media counts
        const { data: userScreens } = await supabase.from('screens').select('id').eq('user_id', user.id);
        const { count: mediaCount } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const screenIds = userScreens?.map(s => s.id) || [];
        
        // Fetch all Face records for history
        const { data: faces, error: facesError } = await supabase
          .from('audience_faces')
          .select('*')
          .order('created_at', { ascending: true });

        if (facesError) throw facesError;

        // --- 📊 AGGREGATE FACE ID COUNT BY DATE ---
        const trafficMap = {};
        
        faces?.forEach(item => {
          // Create a simple date key (e.g., "Feb 16")
          const dateLabel = new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          
          if (!trafficMap[dateLabel]) {
            trafficMap[dateLabel] = { 
                date: dateLabel, 
                faceCount: 0, 
                rawDate: new Date(item.created_at) 
            };
          }
          // Increment for every Face ID entry found on this date
          trafficMap[dateLabel].faceCount += 1; 
        });

        // Convert map to array and sort chronologically
        const sortedTraffic = Object.values(trafficMap).sort((a, b) => a.rawDate - b.rawDate);
        setTrafficData(sortedTraffic);

        // --- 📊 PROCESS DEMOGRAPHICS (Unique Persons) ---
        const uniquePersons = new Set();
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        let male = 0, female = 0, totalAge = 0, count = 0;

        faces?.forEach(f => {
          // Use the mapped person_id if it exists, otherwise the face_external_id
          const id = f.person_id || f.face_external_id || f.id;
          if (uniquePersons.has(id)) return;
          uniquePersons.add(id);

          if (f.gender?.toLowerCase() === 'male') male++;
          if (f.gender?.toLowerCase() === 'female') female++;
          
          const age = Math.round(f.age);
          if (age > 0) {
            totalAge += age;
            count++;
            if (age <= 18) ageBuckets['1-18']++;
            else if (age <= 25) ageBuckets['19-25']++;
            else if (age <= 35) ageBuckets['26-35']++;
            else if (age <= 50) ageBuckets['36-50']++;
            else ageBuckets['51+']++;
          }
        });

        setAgeData(Object.keys(ageBuckets).map(k => ({ range: k, count: ageBuckets[k] })));
        setGenderData([{ name: 'Male', value: male }, { name: 'Female', value: female }]);
        
        setStats({
          screens: screenIds.length,
          media: mediaCount || 0,
          impressions: faces?.length || 0, // Shows the total 981 records
          avgAge: count > 0 ? Math.round(totalAge / count) : 0
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, []);

  if (isLoading) return <div className="p-10 text-center">Crunching Face ID data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Face ID Count (Total)" value={stats.impressions} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      {/* Main Face ID Count Graph */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4">Face ID Detections by Date</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Line 
                name="Face Detections"
                type="monotone" 
                dataKey="faceCount" 
                stroke="#4F46E5" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#4F46E5' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Age Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Gender Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={80} dataKey="value">
                  {genderData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
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