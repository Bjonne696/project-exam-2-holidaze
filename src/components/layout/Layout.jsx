// project-exam-2-hollidaze/src/components/layout/Layout.jsx
import React, { useEffect } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from '../../stores/authStore';
import heroBanner from '../../assets/logo.png'; // Make sure the path is correct

function Layout() {
  const { logoutUser, token, user } = useAuthStore(state => ({
    logoutUser: state.logoutUser,
    token: state.token,
    user: state.user,
  }));
  
  const isAuthenticated = !!token;
  const isVenueManager = user?.venueManager;

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

  return (
    <>
      <div className="bg-page-background relative text-center">
        {/* Holidaze Title and Hero Banner Image on the same line */}
        <div className="flex items-center justify-center py-4">
          <h1 className="text-5xl font-bold text-gray-800 mr-4">Holidaze</h1>
          <img src={heroBanner} alt="Hero Banner" className="w-48 object-cover" />
        </div>

        {/* Navigation Buttons with individual borders */}
        <div className="flex justify-center gap-2 p-4">
          <NavLink to="/" style={buttonStyle} className="bg-card-background rounded-full text-center px-4 py-2">
            Home
          </NavLink>
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
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;