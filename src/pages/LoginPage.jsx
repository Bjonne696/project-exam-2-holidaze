import React, { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate(); // Now useNavigate is defined and can be used

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(credentials);
      navigate('/'); // Redirect to HomePage after successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input input-bordered" required />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input input-bordered" required />
      <button type="submit" className="btn">Login</button>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
      </p>
    </form>
  );
};

export default LoginPage;
