import React, { useState } from 'react';
import { useLoginUser } from '../hooks/useAuthHooks'; // Importing the custom hook for user login
import useAuthStore from '../stores/authStore'; // Importing the store for managing authentication state
import { Link, useNavigate } from 'react-router-dom'; // Importing components from React Router

const LoginPage = () => {
  // State to manage user credentials
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Custom hook for user login
  const { mutate: loginUser, isLoading, isError, error } = useLoginUser(); 

  // React Router's hook for navigation
  const navigate = useNavigate();

  // Function to handle changes in input fields
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials, {
      // Callback function on successful login
      onSuccess: (data) => {
        // Update authentication state with user token
        useAuthStore.getState().setToken(data.accessToken); 
        // Redirect user to the home page
        navigate('/'); 
      },
      // Callback function on login error
      onError: (error) => { 
        let errorMessage = 'An unknown error occurred';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Set error message in state for display
        setErrorMessage(errorMessage);
      }
    });
  };

  // CSS class for button styling
  const buttonStyle = "border border-#810f0f rounded-full text-center px-4 py-2 bg-card-background mx-auto";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {/* Display error message if login fails */}
        {isError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Error during registration:</span> {error.message}
            </div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields for email and password */}
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          {/* Submit button */}
          <button type="submit" className={`btn ${buttonStyle}`} disabled={isLoading}>
            Login
          </button>
          {/* Link to registration page */}
          <p className="text-center mt-4">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
