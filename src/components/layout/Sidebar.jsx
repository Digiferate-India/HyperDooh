// In src/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton'; // ✅ Step 1: Import the new component

function Sidebar() {
  return (
    // ✅ Step 2: Add flex styles to position the button at the bottom
    <nav className="w-64 h-screen bg-gray-100 border-r border-gray-200 p-6 flex flex-col">
      <div>
        <h2 className="text-xl font-bold mb-8 text-black">Digital Signage CMS</h2>
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
      </div>

      {/* ✅ Step 3: Add the LogoutButton component at the end */}
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </nav>
  );
}

export default Sidebar;