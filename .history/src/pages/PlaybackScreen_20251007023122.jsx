// In src/pages/PlaybackScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient'; // Adjust path if needed

function PlaybackScreen() {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // This effect runs once to get the list of screens for the dropdown
  useEffect(() => {
    async function fetchScreens() {
      const { data, error } = await supabase.from('screens').select('id, custom_name');
      
      if (error) {
        alert('Error fetching screens: ' + error.message);
      } else {
        setScreens(data);
      }
    }
    fetchScreens();
  }, []); // The empty array means this runs only once

  // We will add another useEffect here to fetch the playlist

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playback Screen</h1>
      {/* We will build the UI here next */}
    </div>
  );
}

export default PlaybackScreen;