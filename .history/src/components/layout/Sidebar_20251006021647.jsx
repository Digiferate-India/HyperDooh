// In src/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="w-64 h-screen bg-gray-100 border-r border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-8">Digital Signage CMS</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard/pair-screen" className="text-gray-700 hover:text-blue-600">Pair Screen</Link>
        </li>
        <li>
          <Link to="/dashboard/assign-content" className="text-gray-700 hover:text-blue-600">Assign Content</Link>
        </li>
        <li>
          <Link to="/dashboard/upload-media" className="text-gray-700 hover:text-blue-600">Upload Media</Link>
        </li>
        <li>
          <Link to="/dashboard/playback-screen" className="text-gray-700 hover:text-blue-600">Playback Screen</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;