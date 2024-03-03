// project-exam-2-hollidaze/src/components/venues/VenueItem.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import { useDeleteVenue } from '../../hooks/useVenuesApi';

const VenueItem = ({ data, isDetailedView = false, showActions = false, onDeleteClick }) => {
  const { name, description, media, rating, maxGuests, price, created, updated } = data;
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const deleteVenue = useDeleteVenue();

  const handleDelete = () => {
    deleteVenue.mutate(data.id, {
      onSuccess: () => {
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

  const buttonStyle = {
    borderColor: '#810f0f', 
    borderWidth: '3px', 
    borderStyle: 'solid', 
    borderRadius: '25px',
  };

  return (
    <div className="bg-card-background shadow-2xl rounded-lg overflow-hidden my-4" style={{ minHeight: '350px' }}>
      <div className="flex justify-center items-center h-52">
        {media.length > 0 && !imageError ? (
          <img src={media[0]} alt={name} onError={() => setImageError(true)} className="object-cover w-full h-full" />
        ) : (
          <div className="text-lg font-semibold">No image found</div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="mt-2 text-gray-600">Price:{price}</p>
        <p className="mt-2 text-gray-600">Max Guests:{maxGuests}</p>
        <p className="mt-2 text-gray-600">Rating:{rating}</p>
        <div className="flex justify-between mt-4">
          {showActions && (
            <>
              <p className="mt-2 text-gray-600">{description}</p>
              <button className="btn btn-primary" onClick={() => navigate(`/update-venue/${data.id}`)}>Update</button>
              <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
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