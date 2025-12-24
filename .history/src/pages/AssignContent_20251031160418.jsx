import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MediaCard from '../components/MediaCard';

// --- FolderIcon component (no change) ---
function FolderIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-full h-40 object-cover text-yellow-500"
    >
      <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-5.604A3.375 3.375 0 0111.396 3H7.5a3 3 0 00-3 3v12a3 3 0 003 3h12z" />
    </svg>
  );
}

// --- BulkAssignForm component (no change) ---
function BulkAssignForm({ folder, screenId, onClose, onSave }) {
  const [duration, setDuration] = useState(10); 
  const [scheduledTime, setScheduledTime] = useState(''); 
  const [gender, setGender] = useState('All');
  const [ageGroup, setAgeGroup] = useState('All');
  const [orientation, setOrientation] = useState('any'); 
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    await onSave({
      duration,
      scheduledTime: scheduledTime || null, 
      gender,
      ageGroup,
      orientation, 
    });
    
    setIsSaving(false);
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-900">
        <h2 className="text-xl font-bold mb-4">
          Bulk-Assign Settings for "{folder.name}"
        </h2>
        <p className="mb-4">These settings will apply to all media items in this folder for the selected screen.</p>
        
        <form onSubmit={handleSubmit}>
          {/* ... all form inputs ... */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Duration (seconds):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border p-2 rounded-lg text-black " 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Scheduled Time (Optional):</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border p-2 rounded-lg text-black" 
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Gender:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              className="w-full border p-2 rounded-lg text-black" 
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Age Group:</label>
            <select 
              value={ageGroup} 
              onChange={(e) => setAgeGroup(e.target.value)} 
              className="w-full border p-2 rounded-lg text-black" 
            >
              <option value="All">All</option>
              <option value="18-25">18-25</option>
              <option value="26-40">26-40</option>
              <option value="41+">41+</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Orientation:</label>
            <select 
              value={orientation} 
              onChange={(e) => setOrientation(e.target.value)} 
              className="w-full border p-2 rounded-lg text-black" 
            >
              <option value="any">Any (Default)</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-600"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSaving || !screenId}
            >
              {isSaving ? 'Saving...' : 'Apply to All'}
            </button>
          </div>
          {!screenId && <p className="text-red-500 text-sm text-right mt-2">Please select a screen first.</p>}
        </form>
      </div>
    </div>
  );
}


function AssignContent() {
  const [screens, setScreens] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [assignments, setAssignments] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); 
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // --- Effect to fetch data (UPDATED) ---
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: screensData, error: screensError } = await supabase.from('screens').select('id, custom_name');
        if (screensError) throw screensError;
        setScreens(screensData || []);

        // ✅ --- THIS IS THE FIX ---
        // We must select the thumbnail_path here
        const { data: mediaData, error: mediaError } = await supabase.from('media').select('*, thumbnail_path');
        if (mediaError) throw mediaError;
        setAllMedia(mediaData || []);
        
        const { data: foldersData, error: foldersError } = await supabase.from('folders').select('*');
        if (foldersError) throw foldersError;
        setFolders(foldersData || []);

      } catch (error) {
        alert("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Effect to fetch assignments (no change) ---
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);
  useEffect(() => {
    if (!selectedScreen) {
      setAssignments(new Map());
      return;
    }
    async function fetchAssignments() {
      setIsFetchingAssignments(true);
      const { data, error } = await supabase
        .from('screens_media')
        .select('*')
        .eq('screen_id', selectedScreen);
        
      if (error) {
        alert('Error fetching assignments: ' + error.message);
      } else {
        const assignmentsMap = new Map(data.map(item => [item.media_id, item]));
        setAssignments(assignmentsMap);
      }
      setIsFetchingAssignments(false);
    }
    fetchAssignments();
  }, [selectedScreen]);

  // --- handleAssignmentChange (no change) ---
  const handleAssignmentChange = (assignmentUpdate) => {
    setAssignments(prevMap => {
      const newMap = new Map(prevMap);
      
      if (assignmentUpdate.isUnassigned) {
        newMap.delete(assignmentUpdate.media_id);
      } else {
        newMap.set(assignmentUpdate.media_id, assignmentUpdate);
      }
      
      return newMap;
    });
  };
  
  // --- handleBulkAssignSave (no change) ---
  const handleBulkAssignSave = async (formData) => {
    if (!selectedScreen || !currentFolder) {
      alert("Please select a screen and a folder first.");
      return;
    }
    
    try {
      const { error } = await supabase.rpc('bulk_assign_folder_v2', {
        p_screen_id: selectedScreen,
        p_folder_id: currentFolder.id,
        p_duration_sec: formData.duration,
        p_scheduled_time: formData.scheduledTime,
        p_gender_text: formData.gender,
        p_age_group_text: formData.ageGroup,
        p_orientation_text: formData.orientation 
      });
      
      if (error) throw error;
      
      alert(`Success! All media in "${currentFolder.name}" has been assigned.`);
      setIsBulkModalOpen(false); 
      
      const { data, error: fetchError } = await supabase
        .from('screens_media')
        .select('*')
        .eq('screen_id', selectedScreen);
        
      if (fetchError) throw fetchError;
      
      const assignmentsMap = new Map(data.map(item => [item.media_id, item]));
      setAssignments(assignmentsMap);

    } catch (error) {
      alert("Error during bulk assign: " + error.message);
    }
  };

  // --- Helper variables (no change) ---
  const mediaInCurrentFolder = allMedia.filter(
    file => file.folder_id === currentFolder?.id
  );
  const mediaWithoutFolders = allMedia.filter(file => !file.folder_id);

  if (isLoading) return <div className="p-6">Loading...</div>;

  // --- return statement (no change) ---
  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      {/* --- Header and Screen Selector (no change) --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Assign Content</h1>
        <p className="text-gray-600">Select a screen to view and edit its media assignments.</p>
      </div>
      <div className="mb-8">
        <label htmlFor="screen-select" className="text-lg font-semibold">Screen:</label>
        <select
          id="screen-select"
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
          className="ml-4 border p-2 rounded-lg shadow-sm"
        >
          <option value="" disabled>Select a screen</option>
          {screens.map(screen => <option key={screen.id} value={screen.id}>{screen.custom_name}</option>)}
        </select>
      </div>

      {/* --- CONDITIONAL RENDERING (no change) --- */}
      
      {currentFolder ? (
        <div>
          <button
            onClick={() => setCurrentFolder(null)} 
            className="mb-4 font-semibold text-blue-600 hover:underline"
          >
            &larr; Back to Library
          </button>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentFolder.name}</h2>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!selectedScreen || isFetchingAssignments}
            >
              {isFetchingAssignments ? 'Loading...' : 'Bulk-Assign Settings'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaInCurrentFolder.map(mediaItem => (
              <MediaCard
                key={mediaItem.id}
                mediaItem={mediaItem}
                screenId={selectedScreen}
                initialAssignment={assignments.get(mediaItem.id)}
                onAssignmentChange={handleAssignmentChange}
              />
            ))}
          </div>
        </div>
      
      ) : (

        <div>
          <h2 className="text-xl font-bold mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {folders.map(folder => (
              <div 
                key={folder.id} 
                onClick={() => setCurrentFolder(folder)} 
                className="border rounded-lg shadow-md overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow"
              >
                <FolderIcon />
                <div className="p-4">
                  <h3 className="font-semibold truncate text-black">{folder.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-4">Unassigned Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaWithoutFolders.map(mediaItem => (
              <MediaCard
                key={mediaItem.id}
                mediaItem={mediaItem}
                screenId={selectedScreen}
                initialAssignment={assignments.get(mediaItem.id)}
                onAssignmentChange={handleAssignmentChange}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* --- Renders the modal (no change) --- */}
      {isBulkModalOpen && currentFolder && (
        <BulkAssignForm
          folder={currentFolder}
          screenId={selectedScreen}
          onClose={() => setIsBulkModalOpen(false)}
          onSave={handleBulkAssignSave}
        />
      )}
    </div>
  );
}

export default AssignContent;