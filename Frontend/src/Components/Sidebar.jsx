import React, { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";


export default function Sidebar({isSidebarOpen}) {
  
  const [openDashboard, setOpenDashboard] = useState(false);

  
  const toggleDashboard = () => setOpenDashboard(!openDashboard);

  return (
    <div className="relative h-screen">
      {/* Toggle Button */}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b">
          <HomeIcon className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-lg font-bold text-gray-800">TaskHub</h1>
        </div>

        {/* Sidebar List */}
        <ul className="p-4 space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={toggleDashboard}
              className="w-full flex items-center justify-between text-left text-gray-700 hover:bg-gray-100 p-2 rounded"
            >
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 mr-2" />
                <span>Dashboard</span>
              </div>
              {openDashboard ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
            {openDashboard && (
              <ul className="pl-8 mt-1 space-y-1">
                <li className="flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </li>
                <li className="flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Settings
                </li>
              </ul>
            )}
          </li>

          {/* Other List Items */}
          {/* <li className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
            <UserIcon className="h-5 w-5 mr-2" />
            Clients
          </li> */}
          <Link to="/" className="block">
            <li className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded cursor-pointer">
              <UserIcon className="h-5 w-5 mr-2" />
              Clients
            </li>
          </Link>

          <li className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Preferences
          </li>
        </ul>
      </div>
    </div>
  );
}
