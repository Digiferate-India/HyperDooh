import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // ✅ import supabase client

// --- Social Icons (your existing ones) ---
const GoogleIcon = () => (/* ... */);
const FacebookIcon = () => (/* ... */);
const TwitterIcon = () => (/* ... */);
const EyeIcon = ({className}) => (/* ... */);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      console.log("✅ Logged in:", data);
      // You can redirect after login
      // window.location.href = "/home";
    }
  };

  return (
    <div className="flex min-h-screen w-screen font-sans">
      {/* Left Side (unchanged) */}
      {/* ... */}

      {/* Right Side */}
      <div className="flex justify-center items-center flex-1 bg-white px-8 py-12">
        <div className="w-full max-w-sm">

          <h2 className="text-3xl font-bold text-gray-900">Log In</h2>

          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E mail</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="6+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
               >
                    <EyeIcon className="h-5 w-5 text-gray-400"/>
                </button>
            </div>
            <div className="text-right">
                <a href="#" className="text-sm text-gray-600 hover:underline">Forgot Password</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-gray-900 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* --- Social Icons Section (unchanged) --- */}
        </div>
      </div>
    </div>
  );
};

export default Login;
