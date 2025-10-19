// In src/components/MediaCard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  // State for all assignable fields
  const [gender, setGender] = useState(initialAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(initialAssignment?.age_group || 'All');
  const [duration, setDuration] = useState(initialAssignment?.duration || '');
  const [scheduledTime, setScheduledTime] = useState(initialAssignment?.scheduled_time || '');

  // This effect ensures the card's inputs reset when you select a different screen
  useEffect(() => {
    setGender(initialAssignment?.gender || 'All');
    setAgeGroup(initialAssignment?.age_group || 'All');
    setDuration(initialAssignment?.duration || '');
    setScheduledTime(initialAssignment?.scheduled_time || '');
  }, [initialAssignment]);

  // --- This function has been updated ---
  const handleUpdate = async (field, value) => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }

    try {
      // 1. Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to make changes.");

      // 2. Add the user.id to the data you're saving
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id, // This is the new, required line
        [field]: value === '' ? null : value, // Set to null if input is empty
      };

      // 3. The upsert logic is the same
      const { data, error } = await supabase
        .from('screens_media')
        .upsert(updatedData, { onConflict: 'screen_id, media_id' })
        .select()
        .single();

      if (error) throw error; // Let the catch block handle it

      onAssignmentChange(data); // Notify the parent page of the change

    } catch (error) {
      alert(`Error updating assignment: ${error.message}`);
    }
  };

  // --- Event Handlers (no changes) ---
  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    setGender(newGender);
    handleUpdate('gender', newGender);
  };

  const handleAgeChange = (e) => {
    const newAgeGroup = e.target.value;
    setAgeGroup(newAgeGroup);
    handleUpdate('age_group', newAgeGroup);
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    handleUpdate('duration', newDuration);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setScheduledTime(newTime);
    handleUpdate('scheduled_time', newTime);
  };

  // --- Return/JSX (no changes) ---
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <img src={mediaItem.file_path} alt={mediaItem.file_name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        <div className="space-y-3">
          {/* --- New Inputs for Time and Duration --- */}
          <div>
            <label className="text-sm text-gray-600 block">Duration (seconds)</label>
            <input type="number" value={duration} onChange={handleDurationChange} className="w-full p-1 border rounded" placeholder="e.g., 30" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Scheduled Time</label>
            <input type="time" value={scheduledTime} onChange={handleTimeChange} className="w-full p-1 border rounded" />
          </div>
          {/* --- Existing Dropdowns --- */}
          <div>
            <label className="text-sm text-gray-600 block">Gender</label>
            <select value={gender} onChange={handleGenderChange} className="w-full p-1 border rounded">
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Age Group</label>
            <select value={ageGroup} onChange={handleAgeChange} className="w-full p-1 border rounded">
              <option>All</option>
              <option>18-25</option>
              <option>26-40</option>
              <option>41-60</option>
              <option>60+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaCard;