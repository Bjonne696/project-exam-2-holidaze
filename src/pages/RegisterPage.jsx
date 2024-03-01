// project-exam-2-holidaze/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../hooks/useAuthHooks'; // Import the useRegisterUser hook
import useAuthStore from '../stores/authStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });

  const navigate = useNavigate();
  const { mutate: registerUser, error, isLoading } = useRegisterUser(); // Use the hook
  const setToken = useAuthStore((state) => state.setToken); // Assuming you have a setToken action in useAuthStore

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(formData, {
      onSuccess: (data) => {
        setToken(data.accessToken); // Set token in Zustand store and localStorage
        navigate('/'); // Redirect after successful registration
      },
      // Assuming error handling will be done via the `error` variable from useRegisterUser
    });
  };

  // Conditional rendering for loading state and error message
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input input-bordered" />
      <label className="label cursor-pointer">
        <span className="label-text">Are you a venue manager?</span>
        <input type="checkbox" name="venueManager" checked={formData.venueManager} onChange={handleChange} className="checkbox" />
      </label>
      <button type="submit" className="btn" disabled={isLoading}>Register</button>
      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
      </p>
    </form>
  );
};

export default RegisterPage;