// In src/components/ui/StatCard.jsx
import React from 'react';

// We're passing { icon, title, value } as props
function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card" style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px' }}>
      <div className="icon" style={{ marginBottom: '0.5rem' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</h3>
      <p style={{ color: '#64748b' }}>{title}</p>
    </div>
  );
}

export default StatCard;