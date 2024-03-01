// project-exam-2-holidaze/src/components/venues/CreateVenueForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVenue } from '../../hooks/useVenuesApi'; // Import the useCreateVenue hook

const CreateVenueForm = () => {
  const navigate = useNavigate();
  const { mutate: createVenue, error, isLoading } = useCreateVenue(); // Use the React Query hook
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [],
    price: '',
    maxGuests: '',
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: '',
      lng: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    createVenue(payload, {
      onSuccess: () => {
        navigate('/manager-profile'); // Navigate upon successful creation
      },
      // Optionally handle errors directly via the `error` variable
    });
  };


  if (isLoading) return <div>Creating venue...</div>;
  if (error) return <div>Error creating venue: {error.message}</div>;


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