// project-exam-2-holidaze/src/pages/RegisterPage.jsx

import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate to the import

const RegisterPage = () => {
  const [formData, setFormData] = useState({ // Corrected variable name from userData to formData
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });
  const registerUser = useAuthStore((state) => state.registerUser);
  const navigate = useNavigate(); // Correct usage since useNavigate is now imported

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value }); // Corrected from setUserData to setFormData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData); // Corrected from userData to formData
      navigate('/'); // Redirect to HomePage after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      // Optionally handle errors here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" onChange={handleChange} placeholder="Name" className="input input-bordered" />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input input-bordered" />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input input-bordered" />
      <label className="label cursor-pointer">
        <span className="label-text">Are you a venue manager?</span>
        <input type="checkbox" name="venueManager" checked={formData.venueManager} onChange={handleChange} className="checkbox" />
      </label>
      <button type="submit" className="btn">Register</button>
        <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
        </p>
  </form>
  );
};

export default RegisterPage;