// project-exam-2-holidaze/src/pages/RegisterPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useForm } from '../hooks/useForm';
import { InputField } from '../components/ui/InputField';
import { SubmitButton } from '../components/ui/SubmitButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.registerUser);

  const { formData, handleChange, handleSubmit } = useForm(
    { name: '', email: '', password: '', venueManager: false },
    async (formData) => {
      try {
        await registerUser(formData);
        navigate('/');
      } catch (error) {
        console.error("Registration failed:", error);
        // Enhance with user feedback
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField type="text" name="name" onChange={handleChange} placeholder="Name" />
      <InputField type="email" name="email" onChange={handleChange} placeholder="Email" />
      <InputField type="password" name="password" onChange={handleChange} placeholder="Password" />
      <label className="label cursor-pointer flex gap-2 items-center">
        <span>Are you a venue manager?</span>
        <input
          type="checkbox"
          name="venueManager"
          checked={formData.venueManager}
          onChange={handleChange}
          className="checkbox"
        />
      </label>
      <SubmitButton>Register</SubmitButton>
      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
      </p>
    </form>
  );
};

export default RegisterPage;
