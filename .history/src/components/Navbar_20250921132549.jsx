import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              HYPERDOOH
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white'
                    : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white'
                    : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              >
                About
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};