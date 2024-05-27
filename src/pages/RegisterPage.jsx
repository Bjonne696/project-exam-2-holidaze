import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterUser } from '../hooks/useAuthHooks';
import useAuthStore from '../stores/authStore';

// Define the RegisterPage functional component
const RegisterPage = () => {
  // Define state variables to manage form data, error, and success messages
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
    venueManager: false,
  });
  const { mutate: registerUser, error, isLoading } = useRegisterUser(); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Add success message state

  //  Handle input change events
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  //  Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(formData, {
      onSuccess: (data) => {
        //  Set token in local storage and display success message on successful registration
        useAuthStore.getState().setToken(data.accessToken);
        setSuccessMessage("Registration successful!"); // Set success message
      },
      onError: (error) => { 
        //  Set error message based on the received error
        let errorMessage = 'An unknown error occurred';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        setErrorMessage(errorMessage);
      }
    });
  };

  //  Define button style
  const buttonStyle = "border border-#810f0f rounded-full text-center px-4 py-2 bg-card-background mx-auto";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {error && (
          //  Display error message if error exists
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Error during registration:</span> {error.message}
            </div>
          </div>
        )}

        {successMessage && ( // Display success message if exists
          <div className="alert alert-success shadow-lg">
            <div>
              {successMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields for user registration */}
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
          {/* Register button */}
          <button type="submit" className={`btn ${buttonStyle}`} disabled={isLoading}>
            Register
          </button>
          {/* Link to login page */}
          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

//  Export the RegisterPage component
export default RegisterPage;