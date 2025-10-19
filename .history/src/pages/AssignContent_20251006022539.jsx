// In src/pages/AssignContent.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient'; // Make sure this path is correct

function AssignContent() {
  const [screens, setScreens] = useState([]);
  const [media, setMedia] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to fetch initial screens and media for dropdowns
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
        alert("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Effect to fetch assignments whenever a new screen is selected
  useEffect(() => {
    if (!selectedScreen) {
      setAssignments([]);
      return;
    }
    async function fetchAssignments() {
      setIsAssignmentsLoading(true);
      try {
        const { data, error } = await supabase.from('screen_media').select('id, media(id, file_name)').eq('screen_id', selectedScreen);
        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        alert('Error fetching assignments: ' + error.message);
      } finally {
        setIsAssignmentsLoading(false);
      }
    }
    fetchAssignments();
  }, [selectedScreen]);

  // Function to handle adding a new assignment
  const handleAssign = async () => {
    if (!selectedScreen || !selectedMedia) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('screen_media').insert([{ screen_id: selectedScreen, media_id: selectedMedia }]);
      if (error) throw error;
      // Refresh the list of assignments
      const { data, error: fetchError } = await supabase.from('screen_media').select('id, media(id, file_name)').eq('screen_id', selectedScreen);
      if (fetchError) throw fetchError;
      setAssignments(data || []);
    } catch (error) {
      alert('Error assigning content: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle deleting an assignment
  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const { error } = await supabase.from('screen_media').delete().eq('id', assignmentId);
      if (error) throw error;
      setAssignments(current => current.filter(a => a.id !== assignmentId));
    } catch (error) {
      alert('Error deleting assignment: ' + error.message);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Content to a Screen</h1>
      <div className="flex items-center space-x-4 mb-8">
        <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} className="border p-2 rounded">
          <option value="" disabled>Select a screen</option>
          {screens.map(screen => <option key={screen.id} value={screen.id}>{screen.custom_name}</option>)}
        </select>
        <select value={selectedMedia} onChange={(e) => setSelectedMedia(e.target.value)} className="border p-2 rounded">
          <option value="" disabled>Select media</option>
          {media.map(item => <option key={item.id} value={item.id}>{item.file_name}</option>)}
        </select>
        <button onClick={handleAssign} disabled={isSubmitting || !selectedScreen || !selectedMedia} className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {isSubmitting ? 'Assigning...' : 'Assign Content'}
        </button>
      </div>
      <hr />
      <h2 className="text-xl font-bold mt-8 mb-4">Current Assignments for this Screen</h2>
      {isAssignmentsLoading ? <p>Loading assignments...</p> : (
        <ul className="list-disc pl-5">
          {assignments.map(assignment => (
            <li key={assignment.id} className="mb-2">
              {assignment.media.file_name}
              <button onClick={() => handleDelete(assignment.id)} className="ml-4 text-red-500 hover:text-red-700">Delete</button>
            </li>
          ))}
          {assignments.length === 0 && <p>No content assigned to this screen yet.</p>}
        </ul>
      )}
    </div>
  );
}

export default AssignContent;