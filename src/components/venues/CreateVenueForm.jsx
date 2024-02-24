// project-exam-2-holidaze/src/components/venues/CreateVenueForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { createVenue } from '../../hooks/venuesService';

const CreateVenueForm = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore((state) => ({ token: state.token }));
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [], // Consider how you'll collect multiple media links (e.g., as comma-separated in a text input or via multiple file inputs)
    price: '',
    maxGuests: '',
    rating: 0, // Optional
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '', // Optional, with defaults if not provided
      city: '', // Optional
      zip: '', // Optional
      country: '', // Optional
      continent: '', // Optional
      lat: '', // Optional
      lng: '', // Optional
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for media URLs, assuming comma-separated values
    if (name === 'media') {
      const mediaUrls = value.split(',').map(url => url.trim()); // Split by comma and trim whitespace
      setFormData(prevState => ({
        ...prevState,
        media: mediaUrls,
      }));
    } else if (name in formData.meta) {
      setFormData(prevState => ({
        ...prevState,
        meta: { ...prevState.meta, [name]: type === 'checkbox' ? checked : value },
      }));
    } else if (name in formData.location) {
      setFormData(prevState => ({
        ...prevState,
        location: { ...prevState.location, [name]: value },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests, 10),
      location: {
        ...formData.location,
        lat: formData.location.lat ? parseFloat(formData.location.lat) : 0,
        lng: formData.location.lng ? parseFloat(formData.location.lng) : 0,
      },
    };


    try {
      await createVenue(payload, token);
      navigate('/manager-profile'); // Adjust as necessary
    } catch (error) {
      console.error("Error creating venue:", error.message);
    }
  };


  return (
    <div>
      <h2>Add New Venue</h2>
      <form onSubmit={handleSubmit}>
        {/* Venue Name */}
        <div>
          <label>Venue Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* Description */}
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* Price */}
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        {/* Max Guests */}
        <div>
          <label>Max Guests:</label>
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />
        </div>
        {/* Media URLs */}
        <div>
          <label>Media URLs:</label>
          <input
            type="text"
            name="media"
            placeholder="Enter URLs separated by commas"
            value={formData.media.join(', ')} // Join array values with comma for display
            onChange={handleChange}
          />
        </div>
        
        {/* Include inputs for optional fields (media, meta, location) as needed */}
        <button type="submit">Create Venue</button>
      </form>
    </div>
  );
};

export default CreateVenueForm;