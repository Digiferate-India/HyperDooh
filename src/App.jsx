// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout"; // Import the new layout
import DashboardHome from "./pages/dashboard/DashboardHome";
import PairScreen from "./pages/PairScreen";
import UploadMedia from "./pages/UploadMedia"; // Added missing import
import AssignContent from "./pages/AssignContent";
import "./App.css"; // ✅ Make sure this is here!
import PlaybackScreen from "./pages/PlaybackScreen";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // ✅ --- ADDED IMPORT ---
import TermsAndConditions from "./pages/TermsAndConditions"; // ✅ --- ADDED IMPORT ---
import CookiePolicy from "./pages/CookiePolicy"; // ✅ --- ADDED IMPORT ---
import License from "./pages/License"; // ✅ --- ADDED IMPORT ---
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";

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
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/update-password" element={<UpdatePassword />} />
          {/* ✅ --- ADDED NEW ROUTE --- */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/license" element={<License />} />
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
            <Route path="assign-content" element={<AssignContent />} />
            <Route path="playback-screen" element={<PlaybackScreen />} />
            
            {/* Add other dashboard pages here */}
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;