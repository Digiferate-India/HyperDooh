// In src/pages/PairScreen.jsx
import { useState } from 'react';

function PairScreen() {
  const [customName, setCustomName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from reloading
    console.log('Submitting:', { customName, area, city });
    // Supabase logic will go here
  };

  const formRowStyle = {
    marginBottom: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.25rem',
  };

  return (
    <div>
      <h1>Pair a New Screen</h1>
      <form onSubmit={handleSubmit}>
        <div style={formRowStyle}>
          <label htmlFor="customName" style={labelStyle}>Custom Name</label>
          <input id="customName" type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="area" style={labelStyle}>Area</label>
          <input id="area" type="text" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="city" style={labelStyle}>City</label>
          <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <button type="submit">Pair Screen</button>
      </form>
    </div>
  );
}

export default PairScreen;