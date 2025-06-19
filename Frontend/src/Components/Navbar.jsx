import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar({ toggleSidebar, isSidebarOpen }) {
  return (
    <nav className="bg-white px-6 py-3 flex items-center justify-between shadow-md text-black h-[10vh] fixed top-0 left-0 right-0 z-50">
      {/* Left Side: Menu + Logo + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-100 text-black rounded-md"
        >
          {isSidebarOpen ? (
            <Bars3Icon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        <img
          src="/CMlogo-removebg-preview.svg"
          alt="CM Logo"
          className="object-contain rounded-md"
          width={60}
        />
        <h1 className="text-xl font-semibold tracking-wide">TaskHub Admin</h1>
      </div>

      {/* Right Side: Profile */}
      <div className="flex items-center gap-2">
        <FaUserCircle className="text-2xl" />
        <span className="text-base font-medium">Welcome, Admin</span>
      </div>
    </nav>
  );
}

export default Navbar;
