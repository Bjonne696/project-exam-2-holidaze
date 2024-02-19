// src/pages/RegisterPage.jsx
import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Link } from 'react-router-dom';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });
  const registerUser = useAuthStore((state) => state.registerUser);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
    // Redirect or show success message
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