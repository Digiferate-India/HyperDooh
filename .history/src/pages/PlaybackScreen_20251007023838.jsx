// In src/pages/PlaybackScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient'; // Adjust path if needed

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
            .from('screen_media')
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Live Screen Status</h1>
      {/* We will build the grid of ScreenStatusCards here next */}
    </div>
  );
}

export default PlaybackScreen;