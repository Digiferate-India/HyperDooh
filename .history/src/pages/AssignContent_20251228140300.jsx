import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MediaCard from './MediaCard';

// Helper to fetch assignments (placeholder for your existing logic)
// You likely already have this or similar logic in your file.
const fetchAssignments = async (screenId) => {
  if (!screenId) return [];
  const { data, error } = await supabase
    .from('screens_media')
    .select('*')
    .eq('screen_id', screenId);
  return error ? [] : data;
};

export default function AssignContent({ session }) {
  const [mediaInCurrentFolder, setMediaInCurrentFolder] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [assignments, setAssignments] = useState(new Map());
  
  // --- 🆕 NEW STATE: Track which media card is currently open ---
  const [expandedMediaId, setExpandedMediaId] = useState(null);

  // ... (Your existing useEffects for loading media and screens go here) ...

  const handleAssignmentChange = (updatedAssignment) => {
    setAssignments((prev) => {
      const newMap = new Map(prev);
      if (updatedAssignment.isUnassigned) {
        newMap.delete(updatedAssignment.media_id);
      } else {
        newMap.set(updatedAssignment.media_id, updatedAssignment);
      }
      return newMap;
    });
  };

  // --- 🆕 HELPER: Handle the toggle logic ---
  const handleCardToggle = (mediaId) => {
    // If the clicked card is already open, close it (set to null).
    // Otherwise, set it to the new mediaId.
    setExpandedMediaId(prevId => (prevId === mediaId ? null : mediaId));
  };

  return (
    <div className="p-4">
      {/* ... Your Screen Selector and Folder logic ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {mediaInCurrentFolder.map((mediaItem) => (
          <MediaCard
            key={mediaItem.id}
            mediaItem={mediaItem}
            screenId={selectedScreen}
            initialAssignment={assignments.get(mediaItem.id)}
            onAssignmentChange={handleAssignmentChange}
            
            // --- 🆕 PROPS: Pass control down to the child ---
            isExpanded={expandedMediaId === mediaItem.id}
            onToggle={() => handleCardToggle(mediaItem.id)}
          />
        ))}
      </div>
    </div>
  );
}