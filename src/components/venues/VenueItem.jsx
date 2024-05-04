import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDeleteVenue } from '../../hooks/useVenuesApi';

const VenueItem = ({ data, isDetailedView = false, showActions = false, onDeleteClick, hideDescription = false }) => {
  const { name, description, media, rating, maxGuests, price } = data;
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


  return (
    <div className="bg-card-background shadow-lg rounded-lg overflow-hidden my-2 sm:my-4 p-4 h-100">
      {media.length > 0 && !imageError ? (
        <img src={media[0]} alt={name} className="h-52 w-full object-cover" />
      ) : (
        <div className="flex justify-center items-center h-52">
          <div className="text-lg font-semibold">No image found</div>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="mt-2 text-gray-600">Price: {price}</p>
        <p className="mt-2 text-gray-600">Max Guests: {maxGuests}</p>
        <p className="mt-2 text-gray-600">Rating: {rating} ★</p>
        {!hideDescription && <p className="mt-2 text-gray-600">{description}</p>}
        {showActions && (
          <div className="flex justify-between mt-4">
            <button className="btn btn-primary" onClick={() => navigate(`/update-venue/${data.id}`)}>Update</button>
            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
          </div>
        )}
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
  showActions: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  hideDescription: PropTypes.bool,
};

export default VenueItem;