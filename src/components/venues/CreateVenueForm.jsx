import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVenue } from '../../hooks/useVenuesApi'; // Custom hook for creating a venue

/**
 * The CreateVenueForm component allows users to fill out a form to create a new venue.
 * It handles form state, submission, and form data validation.
 */
const CreateVenueForm = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { mutate: createVenue, error, isLoading } = useCreateVenue(); // Custom hook to handle venue creation

  // State to manage form data
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

  /**
   * Handles changes to the form fields.
   * Updates the formData state based on the input type and name.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for media URLs
    if (name === 'media') {
      const mediaUrls = value.split(',').map(url => url.trim()); // Split and trim the URLs
      setFormData(prevState => ({
        ...prevState,
        media: mediaUrls,
      }));
    } else if (name in formData.meta) { // Handling for meta fields
      setFormData(prevState => ({
        ...prevState,
        meta: { ...prevState.meta, [name]: type === 'checkbox' ? checked : value },
      }));
    } else if (name in formData.location) { // Handling for location fields
      setFormData(prevState => ({
        ...prevState,
        location: { ...prevState.location, [name]: value },
      }));
    } else { // Default handling for other fields
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  /**
   * Handles form submission.
   * Validates and prepares the form data before calling the createVenue function.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Prepare form data for submission
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price), // Convert price to float
      maxGuests: parseInt(formData.maxGuests, 10), // Convert maxGuests to integer
      rating: parseFloat(formData.rating), // Convert rating to float
      location: {
        ...formData.location,
        lat: formData.location.lat ? parseFloat(formData.location.lat) : 0, // Convert lat to float
        lng: formData.location.lng ? parseFloat(formData.location.lng) : 0, // Convert lng to float
      },
    };

    // Remove media field if empty
    if (!submissionData.media.length) {
      delete submissionData.media;
    }

    // Call the createVenue function with submission data
    createVenue(submissionData, {
      onSuccess: () => {
        navigate('/manager-profile'); // Navigate to manager profile on success
        console.log("Submitting venue data:", submissionData); // Log the submission data
      },
    });
  };

  // Display loading state
  if (isLoading) return <div>Creating venue...</div>;
  // Display error state
  if (error) return <div>Error creating venue: {error.message}</div>;

  return (
    <div className="bg-page-background p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Venue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-600">Venue Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600">Max Guests:</label>
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600">Media URLs:</label>
          <input
            type="text"
            name="media"
            placeholder="Enter URLs separated by commas"
            value={formData.media.join(', ')} // Join media URLs into a comma-separated string
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        <button type="submit" className="btn">Create Venue</button>
      </form>
    </div>
  );
};

export default CreateVenueForm;
