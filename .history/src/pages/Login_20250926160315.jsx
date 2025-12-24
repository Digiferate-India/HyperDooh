import React, { useState } from "react";

// --- Social Icons ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" className="text-gray-500">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.024C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1DA1F2" viewBox="0 0 24 24" className="text-gray-500">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4 1a9.06 9.06 0 01-2.84 1.1A4.52 4.52 0 0016.11 0c-2.63 0-4.76 2.09-4.76 4.67 0 .37.04.73.12 1.08A12.9 12.9 0 013 1.67a4.52 4.52 0 001.47 6.2A4.4 4.4 0 012 7.1v.06c0 2.27 1.66 4.16 3.87 4.58a4.52 4.52 0 01-2.15.08c.61 1.89 2.38 3.27 4.48 3.31A9.06 9.06 0 012 19.55a12.79 12.79 0 006.92 2.02c8.3 0 12.84-6.74 12.84-12.59 0-.19-.01-.39-.02-.58A9.1 9.1 0 0023 3z"/>
  </svg>
);

const EyeIcon = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

// --- Component ---
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen w-screen font-sans">
      {/* Left Side */}
      <div 
        className="hidden md:flex flex-1 items-center justify-center text-white p-12 bg-cover bg-center"
        style={{ backgroundImage: "url('https://i.postimg.cc/m2cVY7Zn/gradient-wallpapers-5-Q9-Gf0-WSy-Lk-unsplash.jpg')" }}
      >
        <div className="relative w-full max-w-md">
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-10 border border-white/20">
              <h1 className="text-xl font-semibold">HyperDooh</h1>
              <p className="mt-10 text-4xl font-bold leading-snug">
                Reach your audience, Bold and fearless with specialized audience targeting options.
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
               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5">
                    <EyeIcon className="h-5 w-5 text-gray-400"/>
                </button>
            </div>
            <div className="text-right">
                <a href="#" className="text-sm text-gray-600 hover:underline">Forgot Password</a>
            </div>
            <button type="submit" className="w-full py-3 text-white bg-gray-900 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">Or register using</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50">
              <TwitterIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50">
              <GoogleIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50">
              <FacebookIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
