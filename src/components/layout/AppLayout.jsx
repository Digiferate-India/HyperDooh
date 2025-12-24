// In src/components/layout/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function AppLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '2rem' }}>
        {/* The active page component (like Dashboard) will render here */}
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;