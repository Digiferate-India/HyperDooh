import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MediaCard from '../components/MediaCard';

// ✅ --- Add a simple FolderIcon component ---
function FolderIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-full h-40 object-cover text-yellow-500" // Use Tailwind classes
    >
      <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-5.604A3.375 3.375 0 0111.396 3H7.5a3 3 0 00-3 3v12a3 3 0 003 3h12z" />
    </svg>
  );
}

function AssignContent() {
  const [screens, setScreens] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [assignments, setAssignments] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // ✅ --- Add state for folders and navigation ---
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // null = root

  // ✅ --- Effect to fetch screens, all media, AND folders ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Screens
        const { data: screensData, error: screensError } = await supabase.from('screens').select('id, custom_name');
        if (screensError) throw screensError;
        setScreens(screensData || []);

        // Fetch Media
        const { data: mediaData, error: mediaError } = await supabase.from('media').select('*');
        if (mediaError) throw mediaError;
        setAllMedia(mediaData || []);
        
        // Fetch Folders
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
  useEffect(() => {
    if (!selectedScreen) {
      setAssignments(new Map());
      return;
    }
    async function fetchAssignments() {
      const { data, error } = await supabase.from('screens_media').select('*').eq('screen_id', selectedScreen);
      if (error) {
        alert('Error fetching assignments: ' + error.message);
      } else {
        const assignmentsMap = new Map(data.map(item => [item.media_id, item]));
        setAssignments(assignmentsMap);
      }
    }
    fetchAssignments();
  }, [selectedScreen]);

  // --- handleAssignmentChange (no change) ---
  const handleAssignmentChange = (updatedAssignment) => {
    setAssignments(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(updatedAssignment.media_id, updatedAssignment);
      return newMap;
    });
  };

  // ✅ --- Helper variables to filter media ---
  const mediaInCurrentFolder = allMedia.filter(
    file => file.folder_id === currentFolder?.id
  );
  const mediaWithoutFolders = allMedia.filter(file => !file.folder_id);

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
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

      {/* ✅ --- CONDITIONAL RENDERING --- */}
      
      {/* VIEW 1: We are inside a folder */}
      {currentFolder ? (
        <div>
          <button
            onClick={() => setCurrentFolder(null)} // Go back to root
            className="mb-4 font-semibold text-blue-600 hover:underline"
          >
            &larr; Back to Library
          </button>
          <h2 className="text-xl font-bold mb-4">{currentFolder.name}</h2>
          
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

        /* VIEW 2: We are at the root */
        <div>
          {/* --- Folders Section --- */}
          <h2 className="text-xl font-bold mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {folders.map(folder => (
              <div 
                key={folder.id} 
                onClick={() => setCurrentFolder(folder)} // Makes it clickable
                className="border rounded-lg shadow-md overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow"
              >
                <FolderIcon />
                <div className="p-4">
                  <h3 className="font-semibold truncate">{folder.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* --- Unassigned Media Section --- */}
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
    </div>
  );
}

export default AssignContent;