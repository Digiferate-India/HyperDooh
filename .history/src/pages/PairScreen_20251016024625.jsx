// In src/pages/PairScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function PairScreen() {
  const [customName, setCustomName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [screens, setScreens] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

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

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newScreen = {
        custom_name: customName, // ✅ Corrected to match your database column
        area: area,
        city: city,
        pairing_code: pairingCode,
      };

      const { error } = await supabase.from('screens').insert([newScreen]);
      if (error) throw error;
      
      alert(`Screen created successfully! Your code is: ${pairingCode}`);
      
      setCustomName('');
      setArea('');
      setCity('');

      fetchScreens();

    } catch (error) {
      alert('Error creating screen: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Pair a New Screen</h1>
      <form onSubmit={handleSubmit}>
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
                <td style={{ padding: '8px' }}>{screen.custom_name}</td>
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