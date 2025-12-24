// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
