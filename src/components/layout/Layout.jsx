// project-exam-2-hollidaze/src/components/layout/Layout.jsx

import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import heroBanner from '../../assets/logo.png';

function Layout() {
  const { logoutUser, token, user } = useAuthStore((state) => ({
    logoutUser: state.logoutUser,
    token: state.token,
    user: state.user,
  }));

  const isAuthenticated = !!token;
  const isVenueManager = user?.venueManager;

  // State to manage the hamburger menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    console.log(`Logged in: ${isAuthenticated}`);
    console.log(`Venue Manager: ${isVenueManager}`);
  }, [isAuthenticated, isVenueManager]);

  const buttonStyle = {
    borderColor: '#810f0f',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderRadius: '25px',
  };

  // Function to toggle the menu state
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-page-background shadow-md w-full">
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center space-x-4">
            {/* Wrap "Holidaze" text and hero banner in NavLink */}
            <NavLink to="/" className="flex items-center space-x-4">
              <h1 className="text-4xl font-custom text-gray-800 cursor-pointer">Holidaze</h1>
              {/* Conditionally display the hero banner next to the title on larger screens */}
              <img src={heroBanner} alt="Hero Banner" className="w-20 h-20 md:w-32 md:h-32 object-cover hidden sm:block cursor-pointer" />
            </NavLink>
          </div>

          {/* Hamburger Menu Button */}
          <button onClick={toggleMenu} className="sm:hidden p-2">
            {/* Hamburger Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Navigation Buttons - shown/hidden based on isMenuOpen state */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row sm:items-center gap-2 p-4 justify-center w-full`}>
            {isVenueManager && (
              <NavLink to="/manager-profile" style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
                Manager Dashboard
              </NavLink>
            )}
            {isAuthenticated ? (
              <>
                <button onClick={logoutUser} style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
                  Logout
                </button>
                <NavLink to="/profile" style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
                  Login
                </NavLink>
                <NavLink to="/register" style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto mt-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-page-background text-center p-4 shadow-inner">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">© 2024 Holidaze. All Rights Reserved.</span>
          <div className="flex justify-center items-center mt-2 sm:mt-0">
            <NavLink to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</NavLink>
            <span className="mx-2">|</span>
            <NavLink to="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms & Conditions</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
