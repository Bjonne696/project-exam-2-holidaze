// project-exam-2-holidaze/src/components/venues/CreateVenueForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { createVenue } from '../../hooks/venuesService'; // This service needs to be implemented

const CreateVenueForm = () => {
  const [venueData, setVenueData] = useState({
    name: '',
    description: '',
    media: [],
    price: 0,
    maxGuests: 0,
    // Add other fields as necessary
  });
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVenueData({ ...venueData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVenue(venueData, token);
      navigate('/manager-profile'); // Or to the page you prefer
    } catch (error) {
      console.error("Error creating venue:", error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={venueData.name}
        onChange={handleChange}
        placeholder="Venue Name"
        required
      />
      {/* Add inputs for other venue details */}
      <button type="submit">Create Venue</button>
    </form>
  );
};

export default CreateVenueForm;
