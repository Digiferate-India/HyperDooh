import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import DaySelector from './DaySelector';

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  const [gender, setGender] = useState('All');
  const [ageGroup, setAgeGroup] = useState('All');
  const [duration, setDuration] = useState('');
  
  // Recurring Schedule States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyStartTime, setDailyStartTime] = useState('');
  const [dailyEndTime, setDailyEndTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('Mon,Tue,Wed,Thu,Fri,Sat,Sun');

  const [orientation, setOrientation] = useState('any');
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigned, setIsAssigned] = useState(!!initialAssignment);

  useEffect(() => {
    // Populate form from existing assignment
    if (initialAssignment) {
      setGender(initialAssignment.gender || 'All');
      setAgeGroup(initialAssignment.age_group || 'All');
      setDuration(initialAssignment.duration || '');
      setOrientation(initialAssignment.orientation || 'any');
      
      setStartDate(initialAssignment.schedule_start_date || '');
      setEndDate(initialAssignment.schedule_end_date || '');
      setDailyStartTime(initialAssignment.daily_start_time || '');
      setDailyEndTime(initialAssignment.daily_end_time || '');
      if(initialAssignment.days_of_week) setDaysOfWeek(initialAssignment.days_of_week);
      
      setIsAssigned(true);
    } else {
      setIsAssigned(false);
    }
  }, [initialAssignment]);

  const handleSave = async () => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");
      
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id,
        duration: duration ? parseInt(duration, 10) : null,
        
        // Save Recurring Schedule
        schedule_start_date: startDate || null,
        schedule_end_date: endDate || null,
        daily_start_time: dailyStartTime || null,
        daily_end_time: dailyEndTime || null,
        days_of_week: daysOfWeek || null,
        
        // Clear One-Time fields if using recurring
        start_time: null,
        end_time: null,

        gender,
        age_group: ageGroup, // ✅ FIXED: Mapped 'ageGroup' state to 'age_group' column
        orientation,
      };
      
      const { data, error } = await supabase
        .from('screens_media')
        .upsert(updatedData, { onConflict: 'screen_id, media_id' })
        .select()
        .single();
        
      if (error) throw error; 
      onAssignmentChange(data); 
      setIsAssigned(true); 
    } catch (error) {
      alert(`Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnassign = async () => {
    if (!screenId) return;
    if (!window.confirm("Unassign this media?")) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('screens_media').delete().eq('screen_id', screenId).eq('media_id', mediaItem.id);
      if (error) throw error;
      onAssignmentChange({ media_id: mediaItem.id, isUnassigned: true });
      setIsAssigned(false);
      // Reset form
      setDuration(''); setStartDate(''); setEndDate(''); setDailyStartTime(''); setDailyEndTime('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const imageUrl = mediaItem.thumbnail_path || mediaItem.file_path;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <img src={imageUrl} alt={mediaItem.file_name} className="w-full h-40 object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        
        <div className="space-y-3 flex-grow">
           <div>
            <label className="text-xs font-bold text-gray-500">Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-1 border rounded" placeholder="Auto" />
          </div>
          
          <div className="p-2 bg-gray-50 border rounded">
            <label className="text-xs font-bold text-blue-800 block mb-1">Schedule</label>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Start Date" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="End Date" />
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="time" value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Daily Start Time" />
              <input type="time" value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Daily End Time" />
            </div>
            <div className="mt-1">
              <label className="text-[10px] font-bold text-gray-500 block">Days</label>
              <DaySelector selectedDays={daysOfWeek} onChange={setDaysOfWeek} />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-500">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-1 border rounded text-xs"><option>All</option><option>Male</option><option>Female</option></select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Age</label>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full p-1 border rounded text-xs"><option>All</option><option>18-25</option><option>26-40</option><option>41+</option></select>
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="text-xs font-bold text-gray-500">Orientation</label>
            <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full p-1 border rounded text-xs">
              <option value="any">Any</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>

        </div>
        
        <div className="mt-4 pt-2 border-t">
          {!isAssigned ? (
            <button onClick={handleSave} disabled={!screenId || isSaving} className={`w-full px-4 py-2 rounded text-white font-semibold text-sm transition-colors ${!screenId ? 'bg-gray-400 cursor-not-allowed' : isSaving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSaving ? 'Saving...' : 'Assign'}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleSave} disabled={isSaving} className="w-full px-2 py-2 rounded text-white font-semibold text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                Update
              </button>
              <button onClick={handleUnassign} disabled={isSaving} className="w-full px-2 py-2 rounded text-white font-semibold text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-400">
                Unassign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;