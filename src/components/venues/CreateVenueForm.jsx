import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVenue } from '../../hooks/useVenuesApi'; 

const CreateVenueForm = () => {
  const navigate = useNavigate();
  const { mutate: createVenue, error, isLoading } = useCreateVenue(); 
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


    if (name === 'media') {
      const mediaUrls = value.split(',').map(url => url.trim()); 
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
  

    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests, 10),
      rating: parseFloat(formData.rating),
      location: {
        ...formData.location,
        lat: formData.location.lat ? parseFloat(formData.location.lat) : 0,
        lng: formData.location.lng ? parseFloat(formData.location.lng) : 0,
      },
    };

    if (!submissionData.media.length) {
      delete submissionData.media;
    }
  
    createVenue(submissionData, {
      onSuccess: () => {
        navigate('/manager-profile');
        console.log("Submitting venue data:", submissionData);},
    });
  };


  if (isLoading) return <div>Creating venue...</div>;
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
            value={formData.media.join(', ')} 
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