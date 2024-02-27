// project-exam-2-holidaze/src/pages/LoginPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useForm } from '../hooks/useForm';
import { InputField } from '../components/ui/InputField';
import { SubmitButton } from '../components/ui/SubmitButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);

  const { handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (credentials) => {
      try {
        await loginUser(credentials);
        navigate('/');
      } catch (error) {
        console.error("Login failed:", error);
        // Enhance with user feedback
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField type="email" name="email" onChange={handleChange} placeholder="Email" />
      <InputField type="password" name="password" onChange={handleChange} placeholder="Password" />
      <SubmitButton>Login</SubmitButton>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
      </p>
    </form>
  );
};

export default LoginPage;
