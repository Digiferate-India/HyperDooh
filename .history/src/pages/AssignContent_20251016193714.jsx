// In src/pages/AssignContent.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import MediaCard from '../components/MediaCard'; // Import the new component

function AssignContent() {
  const [screens, setScreens] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  // We use a Map for assignments for fast lookups
  const [assignments, setAssignments] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch initial screens and all media on component load
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: screensData, error: screensError } = await supabase.from('screens').select('id, custom_name');
        if (screensError) throw screensError;
        setScreens(screensData || []);

        const { data: mediaData, error: mediaError } = await supabase.from('media').select('*');
        if (mediaError) throw mediaError;
        setAllMedia(mediaData || []);
      } catch (error) {
        alert("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Effect to fetch assignments ONLY when a new screen is selected
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
        // Convert the array of assignments into a Map for easy lookup by media_id
        const assignmentsMap = new Map(data.map(item => [item.media_id, item]));
        setAssignments(assignmentsMap);
      }
    }
    fetchAssignments();
  }, [selectedScreen]);

  // This function is called by a MediaCard when its assignment changes
  const handleAssignmentChange = (updatedAssignment) => {
    setAssignments(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(updatedAssignment.media_id, updatedAssignment);
      return newMap;
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allMedia.map(mediaItem => (
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
  );
}

export default AssignContent;