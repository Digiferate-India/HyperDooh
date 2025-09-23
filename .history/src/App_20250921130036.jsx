import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';             // Your original page content
import About from './pages/About';           // Your new About page

function App() {
  return (
    <div className="bg-gray-800">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;