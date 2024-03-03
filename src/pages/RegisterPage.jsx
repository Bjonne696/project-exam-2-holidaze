// project-exam-2-holidaze/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../hooks/useAuthHooks';
import useAuthStore from '../stores/authStore';

const RegisterPage = () => {
  // Add `avatar` field to the initial form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '', // Add avatar field
    venueManager: false,
  });

  const navigate = useNavigate();
  const { mutate: registerUser, isError, error, isLoading } = useRegisterUser(); // Enhanced to use isError for conditional rendering

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(formData, {
      onSuccess: (data) => {
        // Assuming `data` contains the accessToken and is correctly handled within your Zustand store's `setToken` action
        useAuthStore.getState().setToken(data.accessToken); // Update Zustand store with new token
        navigate('/'); // Redirect to HomePage after successful registration
      },
    });
  };

  return (
    <>
      {isError && <div className="alert alert-error shadow-lg">
        <div>
          <span>Error during registration:</span> {error?.message || 'An unknown error occurred'}
        </div>
      </div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input input-bordered" />
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="Avatar URL (optional)" className="input input-bordered" />
        <label className="label cursor-pointer">
          <span className="label-text">Are you a venue manager?</span>
          <input type="checkbox" name="venueManager" checked={formData.venueManager} onChange={handleChange} className="checkbox" />
        </label>
        <button type="submit" className="btn" disabled={isLoading}>Register</button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
        </p>
      </form>
    </>
  );
};

export default RegisterPage;