// In src/components/MediaCard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  // --- State (UPDATED) ---
  const [gender, setGender] = useState(initialAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(initialAssignment?.age_group || 'All');
  const [duration, setDuration] = useState(initialAssignment?.duration || '');
  const [startTime, setStartTime] = useState(''); // ✅ RENAMED
  const [endTime, setEndTime] = useState('');     // ✅ ADDED
  const [orientation, setOrientation] = useState(initialAssignment?.orientation || 'any');
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigned, setIsAssigned] = useState(!!initialAssignment);

  // Helper to format timestamps for <input type="datetime-local">
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    // Supabase might return 'YYYY-MM-DD HH:MM:SS'
    // Input needs 'YYYY-MM-DDTHH:MM'
    return dateTimeString.replace(' ', 'T').substring(0, 16);
  };

  // --- useEffect (UPDATED) ---
  useEffect(() => {
    setGender(initialAssignment?.gender || 'All');
    setAgeGroup(initialAssignment?.age_group || 'All');
    setDuration(initialAssignment?.duration || '');
    setOrientation(initialAssignment?.orientation || 'any');
    setIsAssigned(!!initialAssignment);
    
    // ✅ Set both start and end times
    setStartTime(formatDateTimeForInput(initialAssignment?.start_time));
    setEndTime(formatDateTimeForInput(initialAssignment?.end_time));
    
  }, [initialAssignment]);

  // --- handleSave (UPDATED) ---
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
      
      // ✅ Use new column names
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id,
        gender: gender,
        age_group: ageGroup,
        duration: parseInt(duration, 10) || null,
        start_time: startTime || null, // ✅ RENAMED
        end_time: endTime || null,     // ✅ ADDED
        orientation: orientation,
      };
      
      const { data, error } = await supabase
        .from('screens_media')
        .upsert(updatedData, { onConflict: 'screen_id, media_id' })
        .select()
        .single();
        
      if (error) throw error; 
      onAssignmentChange(data); 
      setIsAssigned(true); 
    } catch (error) {
      alert(`Error saving assignment: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- handleUnassign (UPDATED) ---
  const handleUnassign = async () => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }
    if (!window.confirm("Are you sure you want to unassign this media?")) {
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('screens_media')
        .delete()
        .eq('screen_id', screenId)
        .eq('media_id', mediaItem.id);
        
      if (error) throw error;
      
      onAssignmentChange({ media_id: mediaItem.id, isUnassigned: true });
      // ✅ Reset all fields
      setGender('All');
      setAgeGroup('All');
      setDuration('');
      setStartTime('');
      setEndTime('');
      setOrientation('any');
      setIsAssigned(false);
      alert('Media unassigned.');
    } catch (error) {
      alert(`Error unassigning: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Event Handlers (UPDATED) ---
  const handleGenderChange = (e) => { setGender(e.target.value); };
  const handleAgeChange = (e) => { setAgeGroup(e.target.value); };
  const handleDurationChange = (e) => { setDuration(e.target.value); };
  const handleStartTimeChange = (e) => { setStartTime(e.target.value); }; // ✅ RENAMED
  const handleEndTimeChange = (e) => { setEndTime(e.target.value); };     // ✅ ADDED
  const handleOrientationChange = (e) => { setOrientation(e.target.value); };

  const imageUrl = mediaItem.thumbnail_path || mediaItem.file_path;

  // --- Return/JSX (UPDATED) ---
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <img src={imageUrl} alt={mediaItem.file_name} className="w-full h-40 object-cover" />
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        
        {/* Form Inputs (UPDATED) */}
        <div className="space-y-3 flex-grow">
           <div>
            <label className="text-sm text-gray-600 block">Duration (seconds)</label>
            <input type="number" value={duration} onChange={handleDurationChange} className="w-full p-1 border rounded" placeholder="e.g., 30" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Start Date & Time</label>
            <input type="datetime-local" value={startTime} onChange={handleStartTimeChange} className="w-full p-1 border rounded" />
          </div>
          
          {/* ✅ --- ADDED END TIME INPUT --- */}
          <div>
            <label className="text-sm text-gray-600 block">End Date & Time</label>
            <input type="datetime-local" value={endTime} onChange={handleEndTimeChange} className="w-full p-1 border rounded" />
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
        
        {/* Button Section (no change) */}
        <div className="mt-4">
          {!isAssigned ? (
            <button
              onClick={handleSave}
              disabled={!screenId || isSaving}
              className={`w-full px-4 py-2 rounded text-white font-semibold transition-colors ${
                !screenId ? 'bg-gray-400 cursor-not-allowed' :
                isSaving ? 'bg-gray-500' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Assign'}
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded text-white font-semibold transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSaving ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={handleUnassign}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded text-white font-semibold transition-colors bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
              >
                Unassign
              </button>
            </div>
          )}
          {!screenId && <p className="text-red-500 text-xs text-center mt-1">Select a screen first</p>}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;