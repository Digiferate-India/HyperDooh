// In src/components/LogoutButton.jsx

import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Tell Supabase to end the user's session
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Could not log out: ' + error.message);
    } else {
      // If logout is successful, send the user to the login page
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Log Out
    </button>
  );
}

export default LogoutButton;