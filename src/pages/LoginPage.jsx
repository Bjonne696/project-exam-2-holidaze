import React, { useState } from 'react';
import { useLoginUser } from '../hooks/useAuthHooks'; 
import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { mutate: loginUser, isLoading, isError, error } = useLoginUser(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials, {
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
              <span>Error logging in:</span> {error?.message || 'An unknown error occurred'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className={`btn ${buttonStyle}`} disabled={isLoading}>
            Login
          </button>
          <p className="text-center mt-4">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;