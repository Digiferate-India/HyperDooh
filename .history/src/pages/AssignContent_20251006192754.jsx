// In src/pages/AssignContent.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

function AssignContent() {
  // State for data from Supabase
  const [screens, setScreens] = useState([]);
  const [media, setMedia] = useState([]);
  
  // State for user selections
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  
  // State for assignments list
  const [assignments, setAssignments] = useState([]);
  
  // State for loading and submission
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to fetch initial screens and media
  useEffect(() => {
    async function fetchData() {
      // ... (This function is the same as before)
    }
    fetchData();
  }, []);

  // Effect to fetch assignments for the selected screen
  useEffect(() => {
    if (!selectedScreen) {
      setAssignments([]);
      return;
    }
    // ... (This function is the same as before)
  }, [selectedScreen]);

  // Function to handle adding a new assignment
  const handleAssign = async () => {
    // ... (This function is the same as before)
  };

  // NEW: Function to handle deleting an assignment
  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('screen_media')
        .delete()
        .eq('id', assignmentId);
      if (error) throw error;
      // Remove the deleted assignment from the local state to update the UI
      setAssignments(currentAssignments => currentAssignments.filter(a => a.id !== assignmentId));
      alert('Assignment deleted successfully.');
    } catch (error) {
      alert('Error deleting assignment: ' + error.message);
    }
  };

  if (isLoading) return <div>Loading screens and media...</div>;

  return (
    <div>
      <h1>Assign Content to a Screen</h1>
      {/* ... (The select dropdowns and assign button are the same as before) ... */}
      <hr style={{ margin: '2rem 0' }} />
      <h2>Current Assignments for this Screen</h2>
      {isAssignmentsLoading ? (
        <p>Loading assignments...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {assignments.map(assignment => (
            <li key={assignment.id}>
              {assignment.media.file_name}
              {/* This button now calls the handleDelete function */}
              <button onClick={() => handleDelete(assignment.id)} style={{ marginLeft: '1rem' }}>Delete</button>
            </li>
          ))}
          {assignments.length === 0 && <p>No content assigned to this screen yet.</p>}
        </ul>
      )}
    </div>
  );
}

export default AssignContent;