// src/pages/Login.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient"; 
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

const EyeIcon = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /> 
    <circle cx="12" cy="12" r="3" /> 
  </svg>
);

const Login = () => {
  const navigate = useNavigate(); // ✅ initialize navigation
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
      navigate("/dashboard"); // ✅ redirect after login
    }
  };

  return (
    <div className="flex min-h-screen w-screen font-sans">
      {/* Left Side */}
      <div
        className="hidden md:flex flex-1 items-center justify-center text-white p-12 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/m2cVY7Zn/gradient-wallpapers-5-Q9-Gf0-WSy-Lk-unsplash.jpg')",
        }}
      >
        <div className="relative w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-10 border border-white/20">
            <h1 className="text-xl font-semibold">HyperDooh</h1>
            <p className="mt-10 text-4xl font-bold leading-snug">
              Reach your audience, Bold and fearless with specialized audience
              targeting options.
            </p>
            <div className="flex mt-8 space-x-2">
              <span className="w-3 h-3 bg-white/50 rounded-full"></span>
              <span className="w-3 h-3 bg-white/50 rounded-full"></span>
              <span className="w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex justify-center items-center flex-1 bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-900">Log In</h2>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E mail
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
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
                <EyeIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Forgot Password
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-gray-900 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
