// In src/pages/PairScreen.jsx
import { useState, useEffect } from 'react'; // ✅ Step 1: Import useEffect
import { supabase } from '../lib/supabaseClient';

function PairScreen() {
  const [customName, setCustomName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Step 2: Add new state for the list of screens and loading status
  const [screens, setScreens] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // ✅ Step 3: Create a function to fetch screens from the database
  const fetchScreens = async () => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from('screens')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setScreens(data);
    }
    setIsLoadingList(false);
  };

  // ✅ Step 4: Use useEffect to fetch screens when the page loads
  useEffect(() => {
    fetchScreens();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newScreen = {
        name: customName, // Corrected from custom_name
        area: area,
        city: city,
        pairing_code: pairingCode,
        // The 'status' column will use its default 'pending' value
      };

      const { error } = await supabase.from('screens').insert([newScreen]);
      if (error) throw error;
      
      alert(`Screen created successfully! Your code is: ${pairingCode}`);
      
      // Clear the form
      setCustomName('');
      setArea('');
      setCity('');

      // ✅ Step 5: Refresh the list after adding a new screen
      fetchScreens();

    } catch (error) {
      alert('Error creating screen: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* --- The Form (No changes here) --- */}
      <h1>Pair a New Screen</h1>
      <form onSubmit={handleSubmit}>
        {/* ... form input fields for name, area, city ... */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="customName" style={{ display: 'block' }}>Custom Name</label>
          <input 
            id="customName" 
            type="text" 
            value={customName} 
            onChange={(e) => setCustomName(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="area" style={{ display: 'block' }}>Area</label>
          <input 
            id="area" 
            type="text" 
            value={area} 
            onChange={(e) => setArea(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="city" style={{ display: 'block' }}>City</label>
          <input 
            id="city" 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Screen'}
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      {/* ✅ Step 6: Add the list of existing screens */}
      <h2>Existing Screens</h2>
      {isLoadingList ? (
        <p>Loading screens...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Pairing Code</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Paired At</th>
            </tr>
          </thead>
          <tbody>
            {screens.map((screen) => (
              <tr key={screen.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{screen.name}</td>
                <td style={{ padding: '8px' }}>{screen.pairing_code}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    color: screen.status === 'paired' ? 'green' : 'orange',
                    fontWeight: 'bold'
                  }}>
                    {screen.status}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>
                  {screen.paired_at ? new Date(screen.paired_at).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PairScreen;