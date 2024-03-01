// project-exam-2-holidaze/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useLoginUser } from '../hooks/useAuthHooks'; // Import the new useLoginUser hook
import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { mutate: loginUser, isLoading, error } = useLoginUser(); // Use the React Query hook
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken); // Assuming you have a setToken action

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials, {
      onSuccess: (data) => {
        setToken(data.accessToken); // Update the Zustand store with the new token
        navigate('/'); // Redirect to HomePage after successful login
      },
      // Optionally handle errors directly via the `error` variable
    });
  };

  // Optionally render loading state and error message
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" className="input input-bordered" required />
      <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" className="input input-bordered" required />
      <button type="submit" className="btn" disabled={isLoading}>Login</button>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
      </p>
    </form>
  );
};

export default LoginPage;