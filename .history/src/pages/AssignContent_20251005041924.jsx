// In src/pages/AssignContent.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

function AssignContent() {
  // State for data from Supabase
  const [screens, setScreens] = useState([]);
  const [media, setMedia] = useState([]);
  
  // State for user selections
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: screensData, error: screensError } = await supabase.from('screens').select('id, custom_name');
        if (screensError) throw screensError;

        const { data: mediaData, error: mediaError } = await supabase.from('media').select('id, file_name');
        if (mediaError) throw mediaError;

        setScreens(screensData || []);
        setMedia(mediaData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAssign = () => {
    if (!selectedScreen || !selectedMedia) {
      alert('Please select a screen and a media file.');
      return;
    }
    // Supabase insert logic will go here
    console.log(`Assigning Media ID ${selectedMedia} to Screen ID ${selectedScreen}`);
  };

  if (isLoading) return <div>Loading screens and media...</div>;

  return (
    <div>
      <h1>Assign Content to a Screen</h1>
      
      <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} style={{ marginRight: '1rem' }}>
        <option value="" disabled>Select a screen</option>
        {screens.map(screen => (
          <option key={screen.id} value={screen.id}>{screen.custom_name}</option>
        ))}
      </select>

      <select value={selectedMedia} onChange={(e) => setSelectedMedia(e.target.value)} style={{ marginRight: '1rem' }}>
        <option value="" disabled>Select a media file</option>
        {media.map(item => (
          <option key={item.id} value={item.id}>{item.file_name}</option>
        ))}
      </select>

      <button onClick={handleAssign}>Assign Content</button>
    </div>
  );
}

export default AssignContent;