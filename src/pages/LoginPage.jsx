// project-exam-2-holidaze/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useLoginUser } from '../hooks/useAuthHooks'; // Import the new useLoginUser hook
import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { mutate: loginUser, isLoading, isError, error } = useLoginUser(); // Use the React Query hook, including isError for conditional rendering
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials, {
      onSuccess: (data) => {
        // Assuming `data` contains the accessToken and is correctly handled within your Zustand store's `setToken` action
        useAuthStore.getState().setToken(data.accessToken); // Directly use Zustand store to update the token
        navigate('/'); // Redirect to HomePage after successful login
      },
    });
  };

  return (
    <>
      {/* Display error message if login fails */}
      {isError && <div className="alert alert-error shadow-lg">
        <div>
          <span>Error logging in:</span> {error?.message || 'An unknown error occurred'}
        </div>
      </div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" className="input input-bordered" required />
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" className="input input-bordered" required />
        <button type="submit" className="btn" disabled={isLoading}>Login</button>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
        </p>
      </form>
    </>
  );
};

export default LoginPage;
