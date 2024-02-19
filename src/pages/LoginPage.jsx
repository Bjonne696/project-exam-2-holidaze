// src/pages/LoginPage.jsx
import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Link } from 'react-router-dom';


const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const loginUser = useAuthStore((state) => state.loginUser);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(credentials);
    // Redirect or show success message
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input input-bordered" />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input input-bordered" />
      <button type="submit" className="btn">Login</button>
        <p className="text-center mt-4">
             Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
        </p>
  </form>
  );
};

export default LoginPage;