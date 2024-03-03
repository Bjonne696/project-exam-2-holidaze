// project-exam-2-hollidaze/src/components/layout/Layout.jsx

import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from '../../stores/authStore';
import heroBanner from '../../assets/logo.png'; // Importing the hero banner image

function Layout() {
  const { logoutUser, token, user } = useAuthStore(state => ({
    logoutUser: state.logoutUser,
    token: state.token,
    user: state.user,
  }));
  const navigate = useNavigate();

  const isAuthenticated = !!token;
  const isVenueManager = user?.venueManager;

  useEffect(() => {
    console.log(`Logged in: ${isAuthenticated}`);
    console.log(`Venue Manager: ${isVenueManager}`);
  }, [isAuthenticated, isVenueManager]);

  return (
    <>
      <div className="flex flex-col items-center bg-page-background h-[30vh] relative">
        {/* Hero Banner Image */}
        <img src={heroBanner} alt="Hero Banner" style={{ left: '74%' }} className="absolute h-full object-cover" />

        <div className="w-full flex flex-col items-center justify-end h-full space-y-2 pb-4 z-10">
          {/* Holidaze Title */}
          <h1 className="text-4xl font-bold text-gray-800">Holidaze</h1>

          {/* Navigation Buttons */}
          <div className="space-y-2">
            <NavLink to="/" className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
              Home
            </NavLink>
            {isVenueManager && (
              <NavLink to="/manager-profile" className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
                Manager Dashboard
              </NavLink>
            )}
            {isAuthenticated ? (
              <>
                <button onClick={logoutUser} className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
                  Logout
                </button>
                <NavLink to="/profile" className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
                  Login
                </NavLink>
                <NavLink to="/register" className="bg-card-background rounded-full border-5 border-custom text-center px-4 py-2">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;