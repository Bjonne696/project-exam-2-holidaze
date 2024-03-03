// project-exam-2-hollidaze/src/components/venues/VenueItem.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-daisyui';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteVenue } from '../../hooks/useVenuesApi'; // Import the useDeleteVenue hook

const VenueItem = ({ data, isDetailedView = false, showActions = false, onDeleteClick }) => {
  const { name, description, media, rating, maxGuests, price, created, updated } = data;
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const deleteVenue = useDeleteVenue(); // Adjusted to use React Query hook
  
  const handleDelete = () => {
    deleteVenue.mutate(data.id, {
      onSuccess: () => {
        // Optionally, trigger a refetch or use onDeleteClick as a callback to refresh the list
        onDeleteClick && onDeleteClick();
      },
    });
  };


  const imageSrc = media.length > 0 ? media[0] : null;
  const imageContent = imageSrc && !imageError ? (
    <img src={imageSrc} alt={name} onError={() => setImageError(true)} className="h-52 w-full object-cover block rounded-t-lg" />
  ) : (
    <h2 className="text-lg font-semibold">No image found</h2>
  );

  if (isDetailedView) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {imageContent}
        <div className="p-4">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
          <p className="mt-2"><span className="font-bold">Rating:</span> {rating} ★</p>
          <p><span className="font-bold">Max Guests:</span> {maxGuests}</p>
          <p><span className="font-bold">Price:</span> ${price}</p>
          <p><span className="font-bold">Created:</span> {new Date(created).toLocaleDateString()}</p>
          <p><span className="font-bold">Updated:</span> {new Date(updated).toLocaleDateString()}</p>
          {/* Render additional details as needed */}
        </div>
      </div>
    );
  }

  // Add buttons if showActions is true
  return (
    <Card className="bg-card-background rounded-custom border-5 border-custom p-4 shadow-md flex flex-col min-h-[360px] w-[280px] overflow-hidden">
      {imageContent}
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-2"><span className="font-bold">Rating:</span> {rating} ★</p>
          <p><span className="font-bold">Max Guests:</span> {maxGuests}</p>
          <p><span className="font-bold">Price:</span> ${price}</p>
        {showActions && (
          <div className="flex justify-between mt-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/update-venue/${data.id}`)}
            >
              Update
            </button>
            <button
              className="btn btn-error"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

VenueItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    media: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    maxGuests: PropTypes.number,
    price: PropTypes.number,
    created: PropTypes.string,
    updated: PropTypes.string,
    meta: PropTypes.object,
    location: PropTypes.object,
    owner: PropTypes.object,
    bookings: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  isDetailedView: PropTypes.bool,
};

export default VenueItem;