import React, { useState } from 'react';

// SVG icons for social login buttons
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.024C18.343 21.128 22 16.991 22 12z"/>
    </svg>
);

const AppleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.01,2.07c-2.48,0-4.38,1.25-5.62,3.35c-1.68,2.83-1.4,7.1,0.56,9.58c1.17,1.48,2.61,2.94,4.52,2.92 c1.79-0.02,2.83-0.9,4.45-2.8c1.29-1.52,1.8-3.08,1.83-3.14c-0.02-0.02-3.4-1.34-3.46-5.32c-0.05-3.2,2.4-4.54,2.58-4.63 c-1.52-1.29-3.7-1.34-4.86-1.36V2.07z M15.1,0.02c1.23,0.08,2.53,0.6,3.48,1.64c-1.06,0.69-2.22,1.15-3.52,1.11 c-1.3-0.04-2.6-0.52-3.6-1.44C12.35,0.49,13.73,0.04,15.1,0.02z"/>
    </svg>
);


const SignUp = () => {
    // State to hold the values of the input fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents the page from reloading
        console.log('Creating account with:', { username, email, password });
        // Here you would typically send the data to a server
    };

    return (
        // Main container that centers the content
        <div className="flex items-center justify-center min-h-screen bg-indigo-50">
            {/* The form card */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our community today!
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full py-2 px-4 text-white font-semibold bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign Up
                        </button>
                    </div>
                </form>

                {/* Social login section */}
                <div className="relative flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500">Or sign up with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button className="flex items-center justify-center w-11 h-11 border border-gray-300 rounded-full hover:bg-gray-50">
                        <GoogleIcon />
                    </button>
                    <button className="flex items-center justify-center w-11 h-11 border border-gray-300 rounded-full hover:bg-gray-50">
                        <FacebookIcon />
                    </button>
                    <button className="flex items-center justify-center w-11 h-11 border border-gray-300 rounded-full hover:bg-gray-50">
                        <AppleIcon />
                    </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;