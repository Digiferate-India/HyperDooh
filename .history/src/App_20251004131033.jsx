// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// Dashboard imports
import PairScreen from "./pages/PairScreen";

function App() {
  const location = useLocation();

  // Hide Navbar on auth and dashboard routes
  const hideNavbar = ["/login", "/signup", "/pair-screen"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard routes */}
          <Route path="/pair-screen" element={<PairScreen />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
