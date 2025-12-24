import React, { useState } from "react"
import { supabase } from "../lib/supabaseClient" // ✅ import your supabase client

// --- Social Icons (unchanged) ---
const GoogleIcon = () => (/* ... */)
const FacebookIcon = () => (/* ... */)
const TwitterIcon = () => (/* ... */)

const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // ✅ store extra user info (name) in auth metadata
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("✅ Check your email to confirm your account!")
      console.log("User:", data.user)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side */}
      <div className="hidden md:flex flex-1 bg-[url('https://i.postimg.cc/m2cVY7Zn/gradient-wallpapers-5-Q9-Gf0-WSy-Lk-unsplash.jpg')] bg-cover bg-center items-center justify-center text-white p-12">
        <div className="max-w-screen">
          <h1 className="text-xl font-semibold">HyperDooh</h1>
          <p className="mt-10 text-3xl font-bold leading-snug">
            Reach your audience, Bold and fearless with specialized audience targeting options.
          </p>
          <div className="flex mt-6 space-x-2">
            <span className="w-3 h-3 bg-white rounded-full"></span>
            <span className="w-3 h-3 bg-white/50 rounded-full"></span>
            <span className="w-3 h-3 bg-white/50 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex justify-center items-center flex-1 bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900">Get Started for free!</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="6+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              By signing up you agree to <a href="#" className="text-blue-600 underline">terms and conditions</a>.
            </p>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-900 rounded-md font-semibold hover:bg-blue-800"
            >
              Register
            </button>
          </form>

          {/* Success/Error Message */}
          {message && <p className="mt-3 text-sm text-center text-gray-700">{message}</p>}

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">Or register using</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Auth (next step) */}
          <div className="flex justify-center space-x-6">
            <button className="flex items-center justify-center w-12 h-12 border rounded-full hover:bg-gray-50">
              <TwitterIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border rounded-full hover:bg-gray-50">
              <GoogleIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border rounded-full hover:bg-gray-50">
              <FacebookIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
