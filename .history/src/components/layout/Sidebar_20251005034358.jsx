// In src/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';

function Sidebar() {
  // Basic styling to make it look like a sidebar
  const sidebarStyle = {
    width: '250px',
    padding: '1.5rem',
    height: '100vh',
    backgroundColor: '#f8f9fa', // A light grey background
    borderRight: '1px solid #dee2e6',
  };

  const linkStyle = {
    display: 'block',
    padding: '0.5rem 0',
    textDecoration: 'none',
    color: '#495057',
  };

  return (
    <nav style={sidebarStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Digital Signage CMS</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        </li>
        <li>
          <Link to="/pair-screen" style={linkStyle}>Pair Screen</Link>
        </li>
        <li>
          <Link to="/assign-content" style={linkStyle}>Assign Content</Link>
        </li>
        <li>
          <Link to="/upload-media" style={linkStyle}>Upload Media</Link>
        </li>
        <li>
          <Link to="/playback-screen" style={linkStyle}>Playback Screen</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;