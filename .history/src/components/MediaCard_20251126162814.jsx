import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import DaySelector from './DaySelector'; // ✅ Import

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  const [gender, setGender] = useState(initialAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(initialAssignment?.age_group || 'All');
  const [duration, setDuration] = useState(initialAssignment?.duration || '');
  
  // ✅ NEW RECURRING STATES
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyStartTime, setDailyStartTime] = useState('');
  const [dailyEndTime, setDailyEndTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('Mon,Tue,Wed,Thu,Fri,Sat,Sun');

  const [orientation, setOrientation] = useState(initialAssignment?.orientation || 'any');
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigned, setIsAssigned] = useState(!!initialAssignment);

  useEffect(() => {
    setGender(initialAssignment?.gender || 'All');
    setAgeGroup(initialAssignment?.age_group || 'All');
    setDuration(initialAssignment?.duration || '');
    setOrientation(initialAssignment?.orientation || 'any');
    setIsAssigned(!!initialAssignment);
    
    // ✅ Populate fields from DB
    setStartDate(initialAssignment?.schedule_start_date || '');
    setEndDate(initialAssignment?.schedule_end_date || '');
    setDailyStartTime(initialAssignment?.daily_start_time || '');
    setDailyEndTime(initialAssignment?.daily_end_time || '');
    if (initialAssignment?.days_of_week) {
      setDaysOfWeek(initialAssignment.days_of_week);
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
      if (!user) throw new Error("You must be logged in to make changes.");
      
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id,
        gender: gender,
        age_group: ageGroup,
        duration: duration ? parseInt(duration, 10) : null,
        // ✅ Save new recurring fields
        schedule_start_date: startDate || null,
        schedule_end_date: endDate || null,
        daily_start_time: dailyStartTime || null,
        daily_end_time: dailyEndTime || null,
        days_of_week: daysOfWeek || null,
        orientation: orientation,
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
      alert(`Error saving assignment: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnassign = async () => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }
    if (!window.confirm("Are you sure you want to unassign this media?")) {
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('screens_media')
        .delete()
        .eq('screen_id', screenId)
        .eq('media_id', mediaItem.id);
      if (error) throw error;
      onAssignmentChange({ media_id: mediaItem.id, isUnassigned: true });
      setGender('All');
      setAgeGroup('All');
      setDuration('');
      // Reset all
      setStartDate(''); setEndDate(''); setDailyStartTime(''); setDailyEndTime('');
      setOrientation('any');
      setIsAssigned(false);
      alert('Media unassigned.');
    } catch (error) {
      alert(`Error unassigning: ${error.message}`);
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
            <label className="text-sm text-gray-600 block">Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-1 border rounded" placeholder="Auto" />
          </div>
          
          {/* ✅ RECURRING UI */}
          <div className="p-2 bg-gray-50 border rounded">
            <label className="text-xs font-bold text-blue-800 block mb-1">Recurring Schedule</label>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-1 border rounded text-xs" title="Start Date" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-1 border rounded text-xs" title="End Date" />
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="time" value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="w-full p-1 border rounded text-xs" title="Daily Start Time" />
              <input type="time" value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="w-full p-1 border rounded text-xs" title="Daily End Time" />
            </div>
            <div className="mt-1">
              <label className="text-[10px] font-bold text-gray-500 block">Days</label>
              <DaySelector selectedDays={daysOfWeek} onChange={setDaysOfWeek} />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-1 border rounded">
              <option>All</option><option>Male</option><option>Female</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Age Group</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full p-1 border rounded">
              <option>All</option><option>18-25</option><option>26-40</option><option>41-60</option><option>60+</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Orientation</label>
            <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full p-1 border rounded">
              <option value="any">Any</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          {!isAssigned ? (
            <button onClick={handleSave} disabled={!screenId || isSaving} className={`w-full px-4 py-2 rounded text-white font-semibold transition-colors ${!screenId ? 'bg-gray-400 cursor-not-allowed' : isSaving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSaving ? 'Saving...' : 'Assign'}
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <button onClick={handleSave} disabled={isSaving} className="w-full px-4 py-2 rounded text-white font-semibold transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                {isSaving ? 'Saving...' : 'Update'}
              </button>
              <button onClick={handleUnassign} disabled={isSaving} className="w-full px-4 py-2 rounded text-white font-semibold transition-colors bg-red-600 hover:bg-red-700 disabled:bg-gray-400">
                Unassign
              </button>
            </div>
          )}
          {!screenId && <p className="text-red-500 text-xs text-center mt-1">Select a screen first</p>}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;