import React, { useEffect } from 'react'; // Ensure useEffect is imported
import { Button, Menu, Navbar } from "react-daisyui";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logAuthStatus } from '../../stores/authStore'; // Adjust the import path as necessary

function Layout() {
  // Use useEffect to call logAuthStatus when the component mounts
  useEffect(() => {
    logAuthStatus();
  }, []); // The empty dependency array means this effect runs once on mount

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
            {/* Login and Register Links */}
            <Menu.Item>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </Menu.Item>
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