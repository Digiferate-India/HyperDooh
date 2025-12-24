// In src/pages/PairScreen.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct for your project

function PairScreen() {
  const [customName, setCustomName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Generate a simple, random pairing code
      const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // 2. Create the new screen object that matches our table columns
      const newScreen = {
        custom_name: customName,
        area: area,
        city: city,
        pairing_code: pairingCode,
      };

      // 3. Insert the data into Supabase
      const { error } = await supabase.from('screens').insert([newScreen]);
      if (error) throw error;
      
      alert(`Screen paired successfully! Your code is: ${pairingCode}`);
      // Clear the form
      setCustomName('');
      setArea('');
      setCity('');

    } catch (error) {
      alert('Error pairing screen: ' + error.message);
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
          {isSubmitting ? 'Pairing...' : 'Pair Screen'}
        </button>
      </form>
    </div>
  );
}

export default PairScreen;