import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

function DashboardHome() {
  const [stats, setStats] = useState({ screens: 0, media: 0, uniquePeople: 0, avgAge: 0 });
  const [trafficData, setTrafficData] = useState([]); 
  const [ageData, setAgeData] = useState([]);         
  const [genderData, setGenderData] = useState([]);   
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUniqueAnalytics() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        // 1. Fetch screens and media counts
        const { count: screenCount } = await supabase.from('screens').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const { count: mediaCount } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

        // 2. Fetch the mapping table (person_analytics) and raw face data
        const { data: analyticsMap } = await supabase.from('person_analytics').select('person_id, all_face_ids');
        const { data: faces } = await supabase.from('audience_faces').select('*').order('created_at', { ascending: true });

        // 3. Create a Lookup Map for Face ID -> Person ID
        const faceToPersonMap = {};
        analyticsMap?.forEach(person => {
          person.all_face_ids?.forEach(faceId => {
            faceToPersonMap[faceId] = person.person_id;
          });
        });

        // 4. Process Data: Group by Date and Filter for UNIQUE People
        const dailyUniqueMap = {}; 
        const globalUniquePeople = new Set();
        const ageBuckets = { '1-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '51+': 0 };
        let totalAge = 0, ageCount = 0, male = 0, female = 0;

        faces?.forEach(face => {
          // Identify the person: use the map, otherwise fallback to face_external_id or row ID
          const personId = faceToPersonMap[face.face_external_id] || face.face_external_id || `raw-${face.id}`;
          const dateKey = new Date(face.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          if (!dailyUniqueMap[dateKey]) {
            dailyUniqueMap[dateKey] = { date: dateKey, uniqueCount: 0, seenPeople: new Set(), rawDate: new Date(face.created_at) };
          }

          // Only increment count if this person hasn't been seen YET ON THIS DAY
          if (!dailyUniqueMap[dateKey].seenPeople.has(personId)) {
            dailyUniqueMap[dateKey].uniqueCount += 1;
            dailyUniqueMap[dateKey].seenPeople.add(personId);
          }

          // Global unique stats for Demographics
          if (!globalUniquePeople.has(personId)) {
            globalUniquePeople.add(personId);
            
            // Gender
            if (face.gender?.toLowerCase() === 'male') male++;
            else if (face.gender?.toLowerCase() === 'female') female++;

            // Age
            const age = Math.round(face.age);
            if (age > 0) {
              totalAge += age;
              ageCount++;
              if (age <= 18) ageBuckets['1-18']++;
              else if (age <= 25) ageBuckets['19-25']++;
              else if (age <= 35) ageBuckets['26-35']++;
              else if (age <= 50) ageBuckets['36-50']++;
              else ageBuckets['51+']++;
            }
          }
        });

        // Finalize States
        setTrafficData(Object.values(dailyUniqueMap).sort((a, b) => a.rawDate - b.rawDate));
        setAgeData(Object.keys(ageBuckets).map(range => ({ range, count: ageBuckets[range] })));
        setGenderData([{ name: 'Male', value: male }, { name: 'Female', value: female }]);
        setStats({
          screens: screenCount || 0,
          media: mediaCount || 0,
          uniquePeople: globalUniquePeople.size,
          avgAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0
        });

      } catch (err) {
        console.error("Analytics Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getUniqueAnalytics();
  }, []);

  if (isLoading) return <div className="p-10 text-center font-medium">Calculating unique audience...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Screens" value={stats.screens} />
        <StatCard title="Active Media" value={stats.media} />
        <StatCard title="Unique People" value={stats.uniquePeople} />
        <StatCard title="Avg Audience Age" value={`${stats.avgAge} yrs`} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Unique Daily Visitors</h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Line type="monotone" dataKey="uniqueCount" name="Unique People" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Age Breakdown (Unique)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Gender Split (Unique)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {genderData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;