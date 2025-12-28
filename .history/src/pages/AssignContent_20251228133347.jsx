import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// --- CONFIGURATION ---
// ⚠️ IMPORTANT: Change this to your actual Supabase Storage Bucket name
const STORAGE_BUCKET = 'media'; 

// --- Icons ---
function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-yellow-500">
      <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-5.604A3.375 3.375 0 0111.396 3H7.5a3 3 0 00-3 3v12a3 3 0 003 3h12z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500 bg-white rounded-full">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function VideoFileIcon() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
      <span className="text-xs font-semibold">VIDEO</span>
    </div>
  );
}

function ImageFileIcon() {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span className="text-xs font-semibold">IMAGE</span>
      </div>
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

// --- Dropdown Component ---
function DayPickerDropdown({ selectedDays, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedArray = selectedDays ? selectedDays.split(',') : [];

  const toggleDay = (e, dayId) => {
    e.stopPropagation();
    let newArray;
    if (selectedArray.includes(dayId)) {
      newArray = selectedArray.filter((d) => d !== dayId);
    } else {
      newArray = [...selectedArray, dayId];
    }
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
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className="w-full border border-gray-300 bg-white p-2 rounded-lg text-sm text-left flex justify-between items-center shadow-sm text-gray-900 hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <span className="truncate font-medium">{getLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
            {DAYS_OPTIONS.map((day) => (
              <div 
                key={day.id}
                onClick={(e) => toggleDay(e, day.id)}
                className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedArray.includes(day.id)}
                  readOnly
                  className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 pointer-events-none" 
                />
                <span className="text-sm text-gray-700 font-medium select-none">{day.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- SINGLE MEDIA ASSIGN MODAL ---
function SingleMediaModal({ media, existingAssignment, screenId, onClose, onSave, onDelete }) {
  const [duration, setDuration] = useState(existingAssignment?.duration || '');
  const [startDate, setStartDate] = useState(existingAssignment?.schedule_start_date || '');
  const [endDate, setEndDate] = useState(existingAssignment?.schedule_end_date || '');
  const [dailyStartTime, setDailyStartTime] = useState(existingAssignment?.daily_start_time || '');
  const [dailyEndTime, setDailyEndTime] = useState(existingAssignment?.daily_end_time || '');
  const [daysOfWeek, setDaysOfWeek] = useState(existingAssignment?.days_of_week || 'Mon,Tue,Wed,Thu,Fri,Sat,Sun');
  const [gender, setGender] = useState(existingAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(existingAssignment?.age_group || 'All');
  const [orientation, setOrientation] = useState(existingAssignment?.orientation || 'any');
  
  const [isSaving, setIsSaving] = useState(false);

  // Helper to ensure we can display the media in the preview
  const getPreviewUrl = () => {
    if (media.url && media.url.startsWith('http')) return media.url;
    // Fallback: construct public URL
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(media.url);
    return data.publicUrl;
  };

  const previewUrl = getPreviewUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      media_id: media.id,
      screen_id: screenId,
      duration: duration ? parseInt(duration) : null,
      schedule_start_date: startDate || null,
      schedule_end_date: endDate || null,
      daily_start_time: dailyStartTime || null,
      daily_end_time: dailyEndTime || null,
      days_of_week: daysOfWeek || null,
      gender,
      age_group: ageGroup,
      orientation
    });
    setIsSaving(false);
  };

  const handleUnassign = async () => {
    if(!window.confirm("Remove this media from the screen?")) return;
    setIsSaving(true);
    await onDelete(media.id);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Preview */}
        <div className="w-full md:w-1/3 bg-gray-900 p-6 flex flex-col items-center justify-center border-r relative">
           {media.type?.startsWith('video') ? (
              <video src={previewUrl} className="w-full h-auto rounded shadow-lg mb-4 max-h-60" controls />
           ) : (
              <img src={previewUrl} alt={media.name} className="w-full h-auto rounded shadow-lg mb-4 max-h-60 object-contain" />
           )}
           <h3 className="font-bold text-lg text-center text-white break-words w-full mt-2">{media.name}</h3>
           {existingAssignment && (
             <div className="mt-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
               Active on Screen
             </div>
           )}
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Configure Assignment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Duration (seconds)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Auto" />
              </div>

              <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Schedule Rules</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs font-bold text-gray-500">Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500">End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs font-bold text-gray-500">Daily Start</label><input type="time" value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-500">Daily End</label><input type="time" value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Days Active</label><DayPickerDropdown selectedDays={daysOfWeek} onChange={setDaysOfWeek} /></div>
              </div>

              <div><label className="block text-sm font-bold text-gray-700">Gender</label><select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border p-2 rounded-lg"><option value="All">All</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
              <div><label className="block text-sm font-bold text-gray-700">Age Group</label><select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full border p-2 rounded-lg"><option value="All">All</option><option value="18-25">18-25</option><option value="26-40">26-40</option><option value="41+">41+</option></select></div>
              <div className="col-span-1 md:col-span-2"><label className="block text-sm font-bold text-gray-700">Orientation</label><select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full border p-2 rounded-lg"><option value="any">Any</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select></div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              {existingAssignment ? (
                <button type="button" onClick={handleUnassign} className="text-red-600 hover:text-red-800 font-semibold text-sm" disabled={isSaving}>Remove Assignment</button>
              ) : (<span></span>)}
              
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Bulk Assign Form (Simplified) ---
function BulkAssignForm({ folder, screenId, onClose, onSave }) {
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyStartTime, setDailyStartTime] = useState('');
  const [dailyEndTime, setDailyEndTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('Mon,Tue,Wed,Thu,Fri,Sat,Sun'); 
  const [gender, setGender] = useState('All');
  const [ageGroup, setAgeGroup] = useState('All');
  const [orientation, setOrientation] = useState('any'); 
  const [isSaving, setIsSaving] = useState(false);

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
      gender, ageGroup, orientation, 
    });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-900 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Bulk-Assign: "{folder.name}"</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
             <label className="block text-sm font-bold mb-1">Duration</label>
             <input type="number" value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full border p-2 rounded" placeholder="Auto" />
          </div>
          <div className="mb-4 border p-3 rounded bg-gray-50">
             <div className="flex justify-between mb-2">
                <span className="font-bold text-sm">Schedule</span>
                <button type="button" onClick={() => {setStartDate(''); setEndDate(''); setDailyStartTime(''); setDailyEndTime(''); setDaysOfWeek('Mon,Tue,Wed,Thu,Fri,Sat,Sun')}} className="text-xs text-red-600">Clear</button>
             </div>
             <DayPickerDropdown selectedDays={daysOfWeek} onChange={setDaysOfWeek} />
             <div className="grid grid-cols-2 gap-2 mt-2">
                <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="border p-1 rounded text-sm"/>
                <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="border p-1 rounded text-sm"/>
             </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Apply All</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
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
  const [editingMedia, setEditingMedia] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: screensData } = await supabase.from('screens').select('id, custom_name');
        setScreens(screensData || []);
        const { data: mediaData } = await supabase.from('media').select('*, thumbnail_path');
        setAllMedia(mediaData || []);
        const { data: foldersData } = await supabase.from('folders').select('*');
        setFolders(foldersData || []);
      } catch (error) { alert("Error fetching data: " + error.message); } finally { setIsLoading(false); }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedScreen) { setAssignments(new Map()); return; }
    async function fetchAssignments() {
      setIsFetchingAssignments(true);
      const { data } = await supabase.from('screens_media').select('*').eq('screen_id', selectedScreen);
      if (data) setAssignments(new Map(data.map(item => [item.media_id, item])));
      setIsFetchingAssignments(false);
    }
    fetchAssignments();
  }, [selectedScreen]);

  const handleSingleSave = async (assignmentData) => {
    try {
      const { data, error } = await supabase.from('screens_media').upsert(assignmentData, { onConflict: 'screen_id, media_id' }).select();
      if (error) throw error;
      setAssignments(prev => { const newMap = new Map(prev); if (data[0]) newMap.set(data[0].media_id, data[0]); return newMap; });
      setEditingMedia(null); 
    } catch (error) { alert("Error saving: " + error.message); }
  };

  const handleSingleDelete = async (mediaId) => {
    try {
       const { error } = await supabase.from('screens_media').delete().eq('screen_id', selectedScreen).eq('media_id', mediaId);
       if (error) throw error;
       setAssignments(prev => { const newMap = new Map(prev); newMap.delete(mediaId); return newMap; });
       setEditingMedia(null); 
    } catch (error) { alert("Error removing: " + error.message); }
  };

  const handleBulkAssignSave = async (formData) => {
    if (!selectedScreen || !currentFolder) return;
    try {
      const { error } = await supabase.rpc('bulk_assign_folder_v2', {
        p_screen_id: selectedScreen, p_folder_id: currentFolder.id, p_duration_sec: formData.duration, 
        p_start_time: null, p_end_time: null, p_schedule_start_date: formData.scheduleStartDate,
        p_schedule_end_date: formData.scheduleEndDate, p_daily_start_time: formData.dailyStartTime,
        p_daily_end_time: formData.dailyEndTime, p_days_of_week: formData.daysOfWeek,
        p_gender_text: formData.gender, p_age_group_text: formData.ageGroup, p_orientation_text: formData.orientation 
      });
      if (error) throw error;
      alert(`Success! Folder assigned.`);
      setIsBulkModalOpen(false); 
      const { data } = await supabase.from('screens_media').select('*').eq('screen_id', selectedScreen);
      setAssignments(new Map(data.map(item => [item.media_id, item])));
    } catch (error) { alert("Error: " + error.message); }
  };

  // --- Helper to resolve URL ---
  const getThumbnailSrc = (item) => {
    // 1. Try to use explicit thumbnail_path
    if (item.thumbnail_path) {
      if (item.thumbnail_path.startsWith('http')) return item.thumbnail_path;
      // Convert relative path to full URL
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(item.thumbnail_path);
      return data.publicUrl;
    }
    
    // 2. If it is an IMAGE, we can fallback to the main URL
    if (item.type && item.type.startsWith('image')) {
      if (item.url && item.url.startsWith('http')) return item.url;
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(item.url);
      return data.publicUrl;
    }

    // 3. If Video and NO thumbnail_path, return null (trigger Icon fallback)
    return null;
  };

  const renderMediaGrid = (mediaList) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {mediaList.map(mediaItem => {
        const isAssigned = assignments.has(mediaItem.id);
        const thumbSrc = getThumbnailSrc(mediaItem);
        const isVideo = mediaItem.type && mediaItem.type.startsWith('video');

        return (
          <div 
            key={mediaItem.id} 
            onClick={() => {
              if(!selectedScreen) { alert("Please select a screen first."); return; }
              setEditingMedia(mediaItem);
            }}
            className={`
              group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border-2 
              ${isAssigned ? 'border-green-500 ring-2 ring-green-100' : 'border-transparent hover:border-blue-300'}
              bg-gray-100
            `}
          >
            {thumbSrc ? (
              <img 
                src={thumbSrc}
                alt={mediaItem.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                   // If image load fails, hide image and show fallback
                   e.target.style.display = 'none'; 
                   e.target.parentElement.classList.add('image-load-failed');
                }}
              />
            ) : (
              // Fallback for when there is no URL (e.g. video without thumb)
              <div className="w-full h-full">
                {isVideo ? <VideoFileIcon /> : <ImageFileIcon />}
              </div>
            )}
            
            {/* If Image Load Failed (handled via JS above), we need a fallback element in DOM? 
                React doesn't easily re-render on onError without state. 
                CSS trick: if img is hidden, background shows. 
                Better: The `src={thumbSrc}` block handles valid URLs. If `thumbSrc` is null, we show icon.
            */}

            {/* If we have a thumbSrc, we might still want an icon overlay if it's a video */}
            {thumbSrc && isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                 <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-semibold truncate">{mediaItem.name}</p>
            </div>
            {isAssigned && <div className="absolute top-2 right-2 shadow-sm"><CheckCircleIcon /></div>}
          </div>
        );
      })}
    </div>
  );

  const mediaInCurrentFolder = allMedia.filter(file => file.folder_id === currentFolder?.id);
  const mediaWithoutFolders = allMedia.filter(file => !file.folder_id);

  if (isLoading) return <div className="p-6 text-center text-gray-500">Loading library...</div>;

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Assign Content</h1>
        <p className="text-gray-500">Manage media assignments for your digital signage screens.</p>
      </div>

      <div className="mb-8 flex items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
        <label htmlFor="screen-select" className="text-lg font-bold text-blue-900 mr-4">Select Screen:</label>
        <select id="screen-select" value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} className="flex-1 max-w-md border-gray-300 border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
          <option value="" disabled>-- Choose a Screen --</option>
          {screens.map(screen => <option key={screen.id} value={screen.id}>{screen.custom_name}</option>)}
        </select>
        {isFetchingAssignments && <span className="ml-4 text-sm text-blue-600 animate-pulse">Loading assignments...</span>}
      </div>

      {currentFolder ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentFolder(null)} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Library
            </button>
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold text-gray-800">{currentFolder.name}</h2>
               <button onClick={() => setIsBulkModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-300 transition-colors" disabled={!selectedScreen || isFetchingAssignments}>Bulk Assign Folder</button>
            </div>
          </div>
          {mediaInCurrentFolder.length === 0 ? <p className="text-gray-400 text-center py-10">Empty folder.</p> : renderMediaGrid(mediaInCurrentFolder)}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
            {folders.map(folder => (
              <div key={folder.id} onClick={() => setCurrentFolder(folder)} className="group cursor-pointer">
                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden bg-white group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                  <div className="bg-yellow-50 p-4 flex justify-center items-center"><FolderIcon /></div>
                  <div className="p-3 border-t"><h3 className="font-semibold text-gray-800 truncate text-sm text-center">{folder.name}</h3></div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Individual Media</h2>
          {mediaWithoutFolders.length === 0 ? <p className="text-gray-400 italic">No files.</p> : renderMediaGrid(mediaWithoutFolders)}
        </div>
      )}
      
      {isBulkModalOpen && currentFolder && <BulkAssignForm folder={currentFolder} screenId={selectedScreen} onClose={() => setIsBulkModalOpen(false)} onSave={handleBulkAssignSave} />}
      {editingMedia && <SingleMediaModal media={editingMedia} existingAssignment={assignments.get(editingMedia.id)} screenId={selectedScreen} onClose={() => setEditingMedia(null)} onSave={handleSingleSave} onDelete={handleSingleDelete} />}
    </div>
  );
}

export default AssignContent;