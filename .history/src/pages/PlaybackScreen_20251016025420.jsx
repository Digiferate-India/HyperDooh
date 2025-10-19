// In src/pages/PlaybackScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import ScreenStatusCard from '../components/ScreenStatusCard'; // Import the new component

function PlaybackScreen() {
  // This state will hold an array of screen objects,
  // where each object also contains its own playlist.
  const [screensWithPlaylists, setScreensWithPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllScreenData() {
      // 1. Fetch all screens
      const { data: screens, error: screensError } = await supabase
        .from('screens')
        .select('id, custom_name');

      if (screensError) {
        console.error("Error fetching screens:", screensError);
        setIsLoading(false);
        return;
      }

      // 2. For each screen, fetch its playlist
      const screensData = await Promise.all(
        screens.map(async (screen) => {
          const { data: playlist, error: playlistError } = await supabase
            .from('screens_media')
            .select('*, media(*)') // Also get the media details
            .eq('screen_id', screen.id);
          
          if (playlistError) {
            console.error(`Error fetching playlist for screen ${screen.id}:`, playlistError);
            return { ...screen, playlist: [] }; // Return screen with empty playlist on error
          }
          
          return { ...screen, playlist };
        })
      );

      setScreensWithPlaylists(screensData);
      setIsLoading(false);
    }

    fetchAllScreenData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading all screen statuses...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Live Screen Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screensWithPlaylists.map(screen => (
          <ScreenStatusCard key={screen.id} screen={screen} />
        ))}
      </div>
    </div>
  );
}

export default PlaybackScreen;