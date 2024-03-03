// project-exam-2-holidaze/src/components/venues/UpdateVenueForm.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchVenueById, useUpdateVenue } from '../../hooks/useVenuesApi';


const UpdateVenueForm = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { data: venue, isLoading: isLoadingVenue } = useFetchVenueById(venueId);
  const { mutate: updateVenue, isLoading: isUpdatingVenue, error: updateError } = useUpdateVenue();


  // Initialize formData state with fields expected in the form.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    media: [],
  });

  useEffect(() => {
    if (venue) {
      setFormData({ 
        ...venue, 
        media: venue.media || [] 
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number' && !isNaN(value)) {
      // Ensure that only numeric values are accepted for price and maxGuests
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'media') {
      setFormData((prev) => ({
        ...prev,
        media: value.split(',').map((url) => url.trim()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVenue({ venueId, formData }, {
        onSuccess: () => {
          navigate('/manager-profile'); // Redirect on success
        },
      });
    } catch (error) {
      console.error('Error updating venue:', error);
      // Log the error response from the server
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      // Optionally, you can set the error state to display a user-friendly message
       setError('Failed to update venue. Please check the provided information.');
    }
  };

  return (
      <div className="container mx-auto my-8 bg-page-background p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Update Venue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Venue Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Venue Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
          <input
            type="number" // Ensure that the input type is 'number'
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* Max Guests */}
        <div>
          <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">Max Guests:</label>
          <input
            type="number" // Ensure that the input type is 'number'
            name="maxGuests"
            id="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* Media URLs */}
        {/* Assuming media is an array of strings */}
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">Media URLs:</label>
          <input
            type="text"
            name="media"
            id="media"
            value={formData.media.join(', ')}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter URLs separated by commas"
          />
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Update Venue</button>
      </form>
      
      <div className="my-8">
  <h3 className="text-xl font-bold mb-4">Venue Bookings</h3>
  {isLoadingVenue ? (
    <p>Loading venue details...</p>
  ) : (
    <ul>
      {venue?.bookings?.map((booking) => ( // Ensure you're accessing bookings from the venue object
        <li key={booking.id}>
          {booking.dateFrom} to {booking.dateTo} - {booking.guests} guests
        </li>
      ))}
    </ul>
  )}
</div>
    </div>
  );
}

export default UpdateVenueForm;