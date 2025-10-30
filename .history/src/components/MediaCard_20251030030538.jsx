// In src/components/MediaCard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  // State for all assignable fields
  const [gender, setGender] = useState(initialAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(initialAssignment?.age_group || 'All');
  const [duration, setDuration] = useState(initialAssignment?.duration || '');
  const [scheduledTime, setScheduledTime] = useState(initialAssignment?.scheduled_time || '');
  const [orientation, setOrientation] = useState(initialAssignment?.orientation || 'any');
  
  // ✅ --- ADDED ---
  // State to manage loading status for the save button
  const [isSaving, setIsSaving] = useState(false);
  // State to track if the data has been saved at least once
  const [isAssigned, setIsAssigned] = useState(!!initialAssignment);

  // This effect ensures the card's inputs reset when you select a different screen
  useEffect(() => {
    setGender(initialAssignment?.gender || 'All');
    setAgeGroup(initialAssignment?.age_group || 'All');
    setDuration(initialAssignment?.duration || '');
    setScheduledTime(initialAssignment?.scheduled_time || '');
    setOrientation(initialAssignment?.orientation || 'any');
    setIsAssigned(!!initialAssignment); // Reset assigned status based on new prop
  }, [initialAssignment]);

  // ✅ --- NEW SAVE FUNCTION ---
  // This function saves ALL settings at once
  const handleSave = async () => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }
    if (!duration) {
      alert('Please enter a duration.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to make changes.");

      // Bundle all the state variables into one object
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id,
        gender: gender,
        age_group: ageGroup,
        duration: parseInt(duration, 10) || null,
        scheduled_time: scheduledTime || null,
        orientation: orientation,
      };

      // Use upsert to create or update the record
      const { data, error } = await supabase
        .from('screens_media')
        .upsert(updatedData, { onConflict: 'screen_id, media_id' })
        .select()
        .single();

      if (error) throw error; 

      onAssignmentChange(data); // Update the parent state
      setIsAssigned(true); // Mark as assigned
      alert('Assignment saved!');

    } catch (error) {
      alert(`Error saving assignment: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ --- UPDATED Event Handlers ---
  // All handlers now ONLY update local state
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAgeGroup(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleTimeChange = (e) => {
    setScheduledTime(e.target.value);
  };

  const handleOrientationChange = (e) => {
    setOrientation(e.target.value);
  };

  // --- Return/JSX (UPDATED) ---
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <img src={mediaItem.file_path} alt={mediaItem.file_name} className="w-full h-40 object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        
        {/* Form Inputs */}
        <div className="space-y-3 flex-grow">
          <div>
            <label className="text-sm text-gray-600 block">Duration (seconds)</label>
            <input type="number" value={duration} onChange={handleDurationChange} className="w-full p-1 border rounded" placeholder="e.g., 30" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Scheduled Time</label>
            <input type="time" value={scheduledTime} onChange={handleTimeChange} className="w-full p-1 border rounded" />
          </div>
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
          <div>
            <label className="text-sm text-gray-600 block">Orientation</label>
            <select value={orientation} onChange={handleOrientationChange} className="w-full p-1 border rounded">
              <option value="any">Any</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
        </div>
        
        {/* ✅ --- ADDED SAVE BUTTON --- */}
        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={!screenId || isSaving}
            className={`w-full px-4 py-2 rounded text-white font-semibold transition-colors ${
              !screenId 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isSaving 
                ? 'bg-gray-500' 
                : isAssigned 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : (isAssigned ? 'Update' : 'Assign')}
          </button>
          {!screenId && <p className="text-red-500 text-xs text-center mt-1">Select a screen first</p>}
        </div>

      </div>
    </div>
  );
}

export default MediaCard;