// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout"; // Import the new layout
import DashboardHome from "./pages/dashboard/DashboardHome";
import PairScreen from "./pages/PairScreen";
import UploadMedia from "./pages/UploadMedia"; // Added missing import
import "./app.css"; // ✅ Make sure this is here!


function App() {
  const location = useLocation();

  // Hide navbar on any route that starts with /dashboard
  const hideNavbar = location.pathname.startsWith("/dashboard");

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

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="pair-screen" element={<PairScreen />} />
            <Route path="upload-media" element={<UploadMedia />} />
            {/* Add other dashboard pages here */}
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;