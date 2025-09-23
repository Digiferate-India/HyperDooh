// components/Navbar.jsx
import React from "react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// FAKE SVG Logo - keep this exactly as is
const PaperjetLogo = () => (
  <svg
    width="100"
    height="24"
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="18"
      fontFamily="Inter, sans-serif"
      fontSize="13"
      fontWeight="bold"
      fill="white"
    >
      HYPERDOOH
    </text>
  </svg>
);

const Navbar = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="px-1 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between py-2 w-screen bg-white/5 backdrop-blur-lg"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5"> {/* Changed to Link */}
              <PaperjetLogo />
            </Link>
          </div>
          <div className="lg:flex lg:gap-x-12">
            <Link to="/" className="hover:text-gray-300"> {/* Changed to Link */}
              Product
            </Link>
            <Link to="/" className="hover:text-gray-300"> {/* Changed to Link */}
              Pricing
            </Link>
            <Link to="/" className="hover:text-gray-300"> {/* Changed to Link */}
              Company
            </Link>
            <Link to="/about" className="hover:text-gray-300"> {/* Changed to Link for About */}
              About
            </Link>
          </div>
          <div className="mr-5.5 hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-7 items-center">
            <Link to="/login" className="text-sm font-semibold leading-6 hover:text-gray-300"> {/* Changed to Link */}
              Sign in
            </Link>
            <Link
              to="/signup"
              className="items-center mr-19.5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;