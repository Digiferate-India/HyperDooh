// In src/components/ScreenStatusCard.jsx
import React from 'react';

function ScreenStatusCard({ screen }) {
  // Determine the currently playing media. For now, it's the first in the list.
  const currentlyPlaying = screen.playlist && screen.playlist.length > 0 ? screen.playlist[0] : null;

  // The rest of the playlist
  const upNext = screen.playlist && screen.playlist.length > 1 ? screen.playlist.slice(1) : [];
  
  // Prefer custom name, otherwise fall back to a readable default using the id
  const screenTitle = (screen.custom_name && screen.custom_name.trim())
    ? screen.custom_name.trim()
    : `Screen ${screen.id}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Screen Title */}
      <h3 className="text-lg font-bold mb-3 border-b pb-2 text-black">{screenTitle}</h3>
      
      {/* Currently Playing Section */}
      {currentlyPlaying ? (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Currently Playing:</p>
          <div className="flex items-center space-x-4">
            <img 
              src={currentlyPlaying.media.file_path} 
              alt={currentlyPlaying.media.file_name}
              className="w-24 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{currentlyPlaying.media.file_name}</p>
              <p className="text-xs text-gray-500">Duration: {currentlyPlaying.duration}s</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No content assigned.</p>
      )}

      {/* Up Next Section */}
      {upNext.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Up Next:</p>
          <ul className="space-y-2">
            {upNext.map(item => (
              <li key={item.id} className="flex items-center space-x-3 text-sm">
                <img src={item.media.file_path} alt={item.media.file_name} className="w-12 h-8 object-cover rounded" />
                <span>{item.media.file_name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ScreenStatusCard;