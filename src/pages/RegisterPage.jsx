import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../hooks/useAuthHooks';
import useAuthStore from '../stores/authStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
    venueManager: false,
  });

  const navigate = useNavigate();
  const { mutate: registerUser, isError, error, isLoading } = useRegisterUser();
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(formData, {
      onSuccess: (data) => {
        useAuthStore.getState().setToken(data.accessToken);
        navigate('/');
      },
    });
  };

  const buttonStyle = "border border-#810f0f rounded-full text-center px-4 py-2 bg-card-background mx-auto";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {isError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Error during registration:</span> {error?.message || 'An unknown error occurred'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Avatar URL (optional)"
            className="input input-bordered w-full"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="venueManager"
              checked={formData.venueManager}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>Are you a venue manager?</span>
          </label>
          <button type="submit" className={`btn ${buttonStyle}`} disabled={isLoading}>
            Register
          </button>
          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;