// In src/pages/PairScreen.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure you have this file

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

  // ... (keep the same JSX from before, but update the button)
  return (
    <div>
      <h1>Pair a New Screen</h1>
      <form onSubmit={handleSubmit}>
        {/* ... all the form inputs ... */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Pairing...' : 'Pair Screen'}
        </button>
      </form>
    </div>
  );
}

export default PairScreen;