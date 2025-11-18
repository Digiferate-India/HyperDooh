// src/components/MediaCard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function MediaCard({ mediaItem, screenId, initialAssignment, onAssignmentChange }) {
  // --- State ---
  const [gender, setGender] = useState(initialAssignment?.gender || 'All');
  const [ageGroup, setAgeGroup] = useState(initialAssignment?.age_group || 'All');
  const [duration, setDuration] = useState(initialAssignment?.duration || '');
  const [startTime, setStartTime] = useState(''); 
  const [endTime, setEndTime] = useState('');     
  const [orientation, setOrientation] = useState(initialAssignment?.orientation || 'any');
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigned, setIsAssigned] = useState(!!initialAssignment);

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    return dateTimeString.replace(' ', 'T').substring(0, 16);
  };

  // ✅ Helper to set Start Time to "Now"
  const handleSetNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  // --- useEffect ---
  useEffect(() => {
    setGender(initialAssignment?.gender || 'All');
    setAgeGroup(initialAssignment?.age_group || 'All');
    setDuration(initialAssignment?.duration || '');
    setOrientation(initialAssignment?.orientation || 'any');
    setIsAssigned(!!initialAssignment);
    setStartTime(formatDateTimeForInput(initialAssignment?.start_time));
    setEndTime(formatDateTimeForInput(initialAssignment?.end_time));
  }, [initialAssignment]);

  // --- handleSave ---
  const handleSave = async () => {
    if (!screenId) {
      alert('Please select a screen first.');
      return;
    }
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to make changes.");
      
      const updatedData = {
        screen_id: screenId,
        media_id: mediaItem.id,
        user_id: user.id,
        gender: gender,
        age_group: ageGroup,
        duration: duration ? parseInt(duration, 10) : null, 
        start_time: startTime || null, 
        end_time: endTime || null,     
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

  // --- handleUnassign ---
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

  // --- Event Handlers ---
  const handleGenderChange = (e) => { setGender(e.target.value); };
  const handleAgeChange = (e) => { setAgeGroup(e.target.value); };
  const handleDurationChange = (e) => { setDuration(e.target.value); };
  const handleStartTimeChange = (e) => { setStartTime(e.target.value); }; 
  const handleEndTimeChange = (e) => { setEndTime(e.target.value); };     
  const handleOrientationChange = (e) => { setOrientation(e.target.value); };

  const imageUrl = mediaItem.thumbnail_path || mediaItem.file_path;

  // --- Return/JSX ---
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <img src={imageUrl} alt={mediaItem.file_name} className="w-full h-40 object-cover" />
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold truncate mb-4" title={mediaItem.file_name}>{mediaItem.file_name}</h3>
        
        <div className="space-y-3 flex-grow">
           <div>
            <label className="text-sm text-gray-600 block">Duration (seconds)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={handleDurationChange} 
              className="w-full p-1 border rounded" 
              placeholder="Auto (3s or Full Video)" 
            />
          </div>
          
          {/* ✅ Start Time with "Now" Button */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600 block">Start Date & Time</label>
              <button 
                type="button" 
                onClick={handleSetNow}
                className="text-xs bg-white-100 text-white px-2 py-0.5 rounded hover:bg-red-200"
              >
                Now
              </button>
            </div>
            <input type="datetime-local" value={startTime} onChange={handleStartTimeChange} className="w-full p-1 border rounded" />
          </div>

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
        
        {/* Button Section */}
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