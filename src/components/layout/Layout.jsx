import React, { useEffect } from 'react';
import { Button, Menu, Navbar } from "react-daisyui";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from '../../stores/authStore'; // Adjusted import

function Layout() {
  const { logoutUser, token, user, setIsVenueManager } = useAuthStore(state => ({
    logoutUser: state.logoutUser,
    token: state.token,
    user: state.user, // Accessing the user object from the store
    setIsVenueManager: state.setIsVenueManager,
  }));
  const navigate = useNavigate();

  const isAuthenticated = !!token; // Determine if user is authenticated
  const isVenueManager = user?.venueManager; // Determine if user is a venue manager

  useEffect(() => {
    // Log authentication status and venue manager status
    console.log(`Logged in: ${isAuthenticated}`);
    console.log(`Venue Manager: ${isVenueManager}`);
  }, [isAuthenticated, isVenueManager]); // Dependency array includes both states

  const handleRevokeManager = () => {
    // Here you would call an API to revoke the manager status or directly update the state
    setIsVenueManager(false);
    navigate('/profile'); // Redirect the user to their profile page after revoking manager status
  };

  return (
    <>
      <Navbar>
        <div className="flex-1">
          <Button tag={Link} to="/" className="text-xl normal-case" color="ghost">
            Logo
          </Button>
        </div>
        
        <div className="flex-none">
          <Menu horizontal={true} className="px-1">
            <Menu.Item>
              <NavLink to="/">Home</NavLink>
            </Menu.Item>
            {isVenueManager && (
              <Menu.Item>
                <NavLink to="/manager-profile">Manager Dashboard</NavLink>
              </Menu.Item>
            )}
            {/* Conditional rendering based on isAuthenticated */}
            {isAuthenticated ? (
              <>
                <Menu.Item>
                  <button onClick={logoutUser} className="btn btn-secondary">Logout</button>
                </Menu.Item>
                <Menu.Item>
                  <NavLink to="/profile">Profile</NavLink>
                </Menu.Item>
                {isVenueManager && (
                  <Menu.Item>
                    <button onClick={handleRevokeManager} className="btn btn-warning">Revoke Manager</button>
                  </Menu.Item>
                )}
              </>
            ) : (
              <>
                <Menu.Item>
                  <Link to="/login" className="btn btn-primary">Login</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/register" className="btn btn-secondary">Register</Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </div>
      </Navbar>
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
