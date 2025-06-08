import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Import the new components
import { ThemeProvider } from './components/Common/ThemeContext';
import Topbar from './components/Navigation/Topbar';
import Sidebar from './components/Navigation/Sidebar';
import Home from './components/Dashboard/Home';
import Product from './components/Product/Product';
import MapDetails from './components/Map/MapDetails';

import { data } from './result'; // Assuming result.js is in the same directory as App.js

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <div className="flex flex-col h-screen font-inter">
          <Topbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex flex-1 overflow-hidden">
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
                role="presentation"
                aria-hidden="true"
              ></div>
            )}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
              <Sidebar />
            </div>
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home data={data} />} />
                <Route path="/product" element={<Product data={data} />} />
                <Route path="/map-details" element={<MapDetails data={data} />} />
              </Routes>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}