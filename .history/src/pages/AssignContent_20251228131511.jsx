import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MediaCard from '../components/MediaCard';

// --- Icons ---
function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-40 object-cover text-yellow-500">
      <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-5.604A3.375 3.375 0 0111.396 3H7.5a3 3 0 00-3 3v12a3 3 0 003 3h12z" />
    </svg>
  );
}

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

// --- ✅ ROBUST MULTI-SELECT DROPDOWN ---
function DayPickerDropdown({ selectedDays, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Safely parse the comma-separated string into an array
  const selectedArray = selectedDays ? selectedDays.split(',') : [];

  const toggleDay = (e, dayId) => {
    // Prevent the click from bubbling up and closing the menu
    e.stopPropagation();

    let newArray;
    if (selectedArray.includes(dayId)) {
      // Remove day
      newArray = selectedArray.filter((d) => d !== dayId);
    } else {
      // Add day
      newArray = [...selectedArray, dayId];
    }
    
    // Sort the days based on our predefined order (Sun -> Sat)
    // This keeps the database string clean (e.g., "Sun,Mon,Tue")
    const sortedDays = DAYS_OPTIONS
      .filter(d => newArray.includes(d.id))
      .map(d => d.id);
    
    onChange(sortedDays.join(','));
  };

  // Label Logic: What to show on the button
  const getLabel = () => {
    if (selectedArray.length === 0) return "Select Days...";
    if (selectedArray.length === 7) return "Every Day";
    return selectedArray.join(', '); // e.g. "Mon, Wed, Fri"
  };

  return (
    <div className="relative w-full">
      {/* 1. The Trigger Button */}
      <button
        type="button" // Important: Prevents form submit
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="w-full border border-gray-300 bg-white p-2 rounded-lg text-sm text-left flex justify-between items-center shadow-sm text-gray-900 hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <span className="truncate font-medium">{getLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 2. The Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible Backdrop to handle "click outside" */}
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* The Actual List */}
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
            {DAYS_OPTIONS.map((day) => (
              <div 
                key={day.id}
                // Toggle when clicking the row
                onClick={(e) => toggleDay(e, day.id)}
                className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedArray.includes(day.id)}
                  onChange={() => {}} // handled by parent div onClick
                  className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none" // pointer-events-none lets the row handle the click
                />
                <span className="text-sm text-gray-700 font-medium select-none">
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

// --- Bulk Assign Form ---
function BulkAssignForm({ folder, screenId, onClose, onSave }) {
  const [duration, setDuration] = useState('');
  
  // Recurring Schedule States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyStartTime, setDailyStartTime] = useState('');
  const [dailyEndTime, setDailyEndTime] = useState('');
  
  // Default: All days selected
  const [daysOfWeek, setDaysOfWeek] = useState('Mon,Tue,Wed,Thu,Fri,Sat,Sun'); 

  // Metadata
  const [gender, setGender] = useState('All');
  const [ageGroup, setAgeGroup] = useState('All');
  const [orientation, setOrientation] = useState('any'); 
  const [isSaving, setIsSaving] = useState(false);

  const handleClearSchedule = () => {
    setStartDate('');
    setEndDate('');
    setDailyStartTime('');
    setDailyEndTime('');
    setDaysOfWeek('Mon,Tue,Wed,Thu,Fri,Sat,Sun'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    await onSave({
      duration: duration ? parseInt(duration) : null,
      scheduleStartDate: startDate || null,
      scheduleEndDate: endDate || null,
      dailyStartTime: dailyStartTime || null,
      dailyEndTime: dailyEndTime || null,
      daysOfWeek: daysOfWeek || null,
      gender,
      ageGroup,
      orientation, 
    });
    
    setIsSaving(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-900 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Bulk-Assign: "{folder.name}"</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-semibold mb-1">Duration (seconds):</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-2 rounded-lg text-black" placeholder="Auto (3s / Full Video)" />
          </div>
          
          {/* Recurring Schedule Section */}
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="font-bold text-gray-700">Recurring Schedule</h3>
              <button 
                type="button" 
                onClick={handleClearSchedule}
                className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold"
              >
                Clear Schedule
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2 rounded bg-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border p-2 rounded bg-white text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Daily Start Time</label>
                <input type="time" value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="w-full border p-2 rounded bg-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Daily End Time</label>
                <input type="time" value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="w-full border p-2 rounded bg-white text-sm" />
              </div>
            </div>

            {/* ✅ UPDATED: Robust Dropdown Component */}
            <div className="mb-2 relative">
              <label className="block text-xs font-bold text-gray-500 mb-1">Repeat On</label>
              <DayPickerDropdown 
                selectedDays={daysOfWeek} 
                onChange={setDaysOfWeek} 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border p-2 rounded-lg text-black">
              <option value="All">All</option><option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Age Group:</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full border p-2 rounded-lg text-black">
              <option value="All">All</option><option value="18-25">18-25</option><option value="26-40">26-40</option><option value="41+">41+</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Orientation:</label>
            <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full border p-2 rounded-lg text-black">
              <option value="any">Any</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="text-gray-600" disabled={isSaving}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400" disabled={isSaving || !screenId}>
              {isSaving ? 'Saving...' : 'Apply to All'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Page Component ---
function AssignContent() {
  const [screens, setScreens] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [assignments, setAssignments] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: screensData, error: screensError } = await supabase.from('screens').select('id, custom_name');
        if (screensError) throw screensError;
        setScreens(screensData || []);
        const { data: mediaData, error: mediaError } = await supabase.from('media').select('*, thumbnail_path');
        if (mediaError) throw mediaError;
        setAllMedia(mediaData || []);
        const { data: foldersData, error: foldersError } = await supabase.from('folders').select('*');
        if (foldersError) throw foldersError;
        setFolders(foldersData || []);
      } catch (error) { alert("Error fetching data: " + error.message); } finally { setIsLoading(false); }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedScreen) { setAssignments(new Map()); return; }
    async function fetchAssignments() {
      setIsFetchingAssignments(true);
      const { data, error } = await supabase.from('screens_media').select('*').eq('screen_id', selectedScreen);
      if (error) { alert('Error: ' + error.message); } 
      else { setAssignments(new Map(data.map(item => [item.media_id, item]))); }
      setIsFetchingAssignments(false);
    }
    fetchAssignments();
  }, [selectedScreen]);

  const handleAssignmentChange = (assignmentUpdate) => {
    setAssignments(prevMap => {
      const newMap = new Map(prevMap);
      if (assignmentUpdate.isUnassigned) { newMap.delete(assignmentUpdate.media_id); } 
      else { newMap.set(assignmentUpdate.media_id, assignmentUpdate); }
      return newMap;
    });
  };
  
  const handleBulkAssignSave = async (formData) => {
    if (!selectedScreen || !currentFolder) { alert("Please select a screen and a folder first."); return; }
    try {
      const { error } = await supabase.rpc('bulk_assign_folder_v2', {
        p_screen_id: selectedScreen,
        p_folder_id: currentFolder.id,
        p_duration_sec: formData.duration, 
        p_start_time: null, 
        p_end_time: null,     
        p_schedule_start_date: formData.scheduleStartDate,
        p_schedule_end_date: formData.scheduleEndDate,
        p_daily_start_time: formData.dailyStartTime,
        p_daily_end_time: formData.dailyEndTime,
        p_days_of_week: formData.daysOfWeek,
        p_gender_text: formData.gender,
        p_age_group_text: formData.ageGroup,
        p_orientation_text: formData.orientation 
      });
      if (error) throw error;
      alert(`Success! All media in "${currentFolder.name}" has been assigned.`);
      setIsBulkModalOpen(false); 
      const { data, error: fetchError } = await supabase.from('screens_media').select('*').eq('screen_id', selectedScreen);
      if (fetchError) throw fetchError;
      const assignmentsMap = new Map(data.map(item => [item.media_id, item]));
      setAssignments(assignmentsMap);
    } catch (error) { alert("Error during bulk assign: " + error.message); }
  };

  const mediaInCurrentFolder = allMedia.filter(file => file.folder_id === currentFolder?.id);
  const mediaWithoutFolders = allMedia.filter(file => !file.folder_id);

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Assign Content</h1>
        <p className="text-gray-600">Select a screen to view and edit its media assignments.</p>
      </div>
      <div className="mb-8">
        <label htmlFor="screen-select" className="text-lg font-semibold">Screen:</label>
        <select id="screen-select" value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} className="ml-4 border p-2 rounded-lg shadow-sm">
          <option value="" disabled>Select a screen</option>
          {screens.map(screen => <option key={screen.id} value={screen.id}>{screen.custom_name}</option>)}
        </select>
      </div>

      {currentFolder ? (
        <div>
          <button onClick={() => setCurrentFolder(null)} className="mb-4 font-semibold text-blue-600 hover:underline">&larr; Back to Library</button>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentFolder.name}</h2>
            <button onClick={() => setIsBulkModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400" disabled={!selectedScreen || isFetchingAssignments}>
              {isFetchingAssignments ? 'Loading...' : 'Bulk-Assign Settings'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaInCurrentFolder.map(mediaItem => (
              <MediaCard key={mediaItem.id} mediaItem={mediaItem} screenId={selectedScreen} initialAssignment={assignments.get(mediaItem.id)} onAssignmentChange={handleAssignmentChange} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {folders.map(folder => (
              <div key={folder.id} onClick={() => setCurrentFolder(folder)} className="border rounded-lg shadow-md overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow">
                <FolderIcon />
                <div className="p-4"><h3 className="font-semibold truncate text-black">{folder.name}</h3></div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-4">Unassigned Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaWithoutFolders.map(mediaItem => (
              <MediaCard key={mediaItem.id} mediaItem={mediaItem} screenId={selectedScreen} initialAssignment={assignments.get(mediaItem.id)} onAssignmentChange={handleAssignmentChange} />
            ))}
          </div>
        </div>
      )}
      
      {isBulkModalOpen && currentFolder && (
        <BulkAssignForm folder={currentFolder} screenId={selectedScreen} onClose={() => setIsBulkModalOpen(false)} onSave={handleBulkAssignSave} />
      )}
    </div>
  );
}

export default AssignContent;