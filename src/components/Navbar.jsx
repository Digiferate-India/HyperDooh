// components/Navbar.jsx
import React, { useState } from "react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// FAKE SVG Logo - keep this exactly as is
const PaperjetLogo = ({ isMobile = false }) => (
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
      fill={isMobile ? "black" : "white"}
    >
      HYPERDOOH
    </text>
  </svg>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between py-4 w-full bg-white/5 backdrop-blur-lg"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5"> {/* Changed to Link */}
              <PaperjetLogo />
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link to="/" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Pricing
            </Link>
            {/* <Link to="/" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Company
            </Link> */}
            <Link to="/about" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              About
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 items-center">
            <Link to="/login" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign up
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5">
                  <PaperjetLogo isMobile={true} />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Link to="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Home
                    </Link>
                    <Link to="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Pricing
                    </Link>
                    {/* <Link to="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Company
                    </Link> */}
                    <Link to="/about" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      About
                    </Link>
                  </div>
                  <div className="py-6">
                    <Link to="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Sign in
                    </Link>
                    <Link to="/signup" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;