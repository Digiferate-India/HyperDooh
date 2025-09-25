import React from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">HyperDoor</h1>
          <p className="text-blue-100 text-sm">
            A central hub where team can plan, execute and achieve things together
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Register</h2>
            <p className="text-gray-600 text-sm">
              Get Started for free!
            </p>
          </div>

          <form className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E mail
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="6+ characters"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="text-center text-xs text-gray-500 mb-4">
              By signing up you agree to terms and conditions at zoho.
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
              >
                Sign up
              </button>
              
              <Link to="/login">
                <button
                  type="button"
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all border border-gray-300"
                >
                  Login
                </button>
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or register using</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login Options */}
          <div className="flex justify-center space-x-4">
            <button className="p-3 bg-red-50 rounded-full hover:bg-red-100 transition-all">
              <span className="text-red-600 font-semibold">G</span>
            </button>
            <button className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition-all">
              <span className="text-blue-600 font-semibold">f</span>
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
              <span className="text-gray-700 font-semibold">in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;