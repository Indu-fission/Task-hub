import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Chatbot from "./Pages/Chatbot";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f5f1ec]">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex pt-[10vh]">
          <Sidebar isSidebarOpen={isSidebarOpen} />

          <div
            className={`transition-all duration-300 flex-1 min-h-[90vh] ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients/:id/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
