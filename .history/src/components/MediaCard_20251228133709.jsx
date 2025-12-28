import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// --- Constants for Days ---
const DAYS_OPTIONS = [
  { id: 'Sun', label: 'Every Sunday' },
  { id: 'Mon', label: 'Every Monday' },
  { id: 'Tue', label: 'Every Tuesday' },
  { id: 'Wed', label: 'Every Wednesday' },
  { id: 'Thu', label: 'Every Thursday' },
  { id: 'Fri', label: 'Every Friday' },
  { id: 'Sat', label: 'Every Saturday' },
];

// --- ✅ NEW: Custom Dropdown Component ---
function DayPickerDropdown({ selectedDays, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Safely parse the comma-separated string into an array
  const selectedArray = selectedDays ? selectedDays.split(',') : [];

  const toggleDay = (e, dayId) => {
    e.stopPropagation(); // Prevent closing when clicking a checkbox
    let newArray;
    if (selectedArray.includes(dayId)) {
      newArray = selectedArray.filter((d) => d !== dayId);
    } else {
      newArray = [...selectedArray, dayId];
    }
    
    // Sort days based on standard week order
    const sortedDays = DAYS_OPTIONS
      .filter(d => newArray.includes(d.id))
      .map(d => d.id);
    
    onChange(sortedDays.join(','));
  };

  const getLabel = () => {
    if (selectedArray.length === 0) return "Select Days...";
    if (selectedArray.length === 7) return "Every Day";
    return selectedArray.join(', ');
  };

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        // ✅ FIXED: Added !bg-white and !text-gray-900 to override global button styles
        className="w-full border border-gray-300 !bg-white !text-gray-900 p-1 rounded text-[10px] text-left flex justify-between items-center shadow-sm hover:border-blue-500 focus:outline-none"
      >
        <span className="truncate font-medium">{getLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }} 
          />
          
          {/* Checkbox List */}
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto left-0">
            {DAYS_OPTIONS.map((day) => (
              <div 
                key={day.id}
                onClick={(e) => toggleDay(e, day.id)}
                className="flex items-center px-2 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <input
                  type="checkbox"
                  checked={selectedArray.includes(day.id)}
                  onChange={() => {}} // handled by div click
                  className="mr-2 h-3 w-3 text-blue-600 rounded border-gray-300 pointer-events-none"
                />
                <span className="text-[10px] text-gray-700 font-medium select-none">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main Component ---
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

  const handleClearSchedule = () => {
    setStartDate('');
    setEndDate('');
    setDailyStartTime('');
    setDailyEndTime('');
    // Optional: Reset days to all days or empty? 
    // setDaysOfWeek('Mon,Tue,Wed,Thu,Fri,Sat,Sun'); 
  };

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
        
        schedule_start_date: startDate || null,
        schedule_end_date: endDate || null,
        daily_start_time: dailyStartTime || null,
        daily_end_time: dailyEndTime || null,
        days_of_week: daysOfWeek || null,
        
        start_time: null,
        end_time: null,

        gender,
        age_group: ageGroup,
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
      setDuration(''); setStartDate(''); setEndDate(''); setDailyStartTime(''); setDailyEndTime('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const imageUrl = mediaItem.thumbnail_path || mediaItem.file_path;

  return (
    // Note: rounded-lg enables the dropdown to flow outside if needed
    <div className="border rounded-lg shadow-md bg-white flex flex-col relative">
      <img src={imageUrl} alt={mediaItem.file_name} className="w-full h-40 object-cover rounded-t-lg" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        
        <div className="space-y-3 flex-grow">
           <div>
            <label className="text-xs font-bold text-gray-500">Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-1 border rounded" placeholder="Auto" />
          </div>
          
          <div className="p-2 bg-gray-50 border rounded relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-blue-800">Schedule</label>
              <button 
                type="button" 
                onClick={handleClearSchedule}
                className="text-[10px] text-red-600 hover:underline !bg-transparent"
              >
                Clear
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Start Date" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="End Date" />
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <input type="time" value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Daily Start Time" />
              <input type="time" value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="w-full p-1 border rounded text-[10px]" title="Daily End Time" />
            </div>
            
            {/* ✅ UPDATED: Fixed Dropdown Background Color */}
            <div className="mt-1">
              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Repeat On</label>
              <DayPickerDropdown selectedDays={daysOfWeek} onChange={setDaysOfWeek} />
            </div>
          </div>

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