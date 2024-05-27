import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDeleteVenue } from '../../hooks/useVenuesApi';

/**
 * VenueItem component displays venue details.
 * @param {Object} data - The data of the venue.
 * @param {boolean} isDetailedView - Flag to show detailed view.
 * @param {boolean} showActions - Flag to show action buttons (update, delete).
 * @param {function} onDeleteClick - Callback function to execute on delete.
 * @param {boolean} hideDescription - Flag to hide description.
 */
const VenueItem = ({ data, isDetailedView = false, showActions = false, onDeleteClick, hideDescription }) => {
  const { name, description, media, rating, maxGuests, price } = data;
  const [imageError, setImageError] = useState(false); // State to handle image load errors
  const navigate = useNavigate();
  const deleteVenue = useDeleteVenue();

  /**
   * Handles the deletion of a venue.
   */
  const handleDelete = () => {
    deleteVenue.mutate(data.id, {
      onSuccess: () => {
        onDeleteClick && onDeleteClick();
      },
    });
  };

  return (
    <div className="bg-amber-200 shadow-lg rounded-lg overflow-hidden my-2 sm:my-4 p-4">
      {media.length > 0 && !imageError ? (
        <img 
          src={media[0]} 
          alt={name} 
          className="h-52 w-full object-cover" 
          onError={() => setImageError(true)} // Handle image load error
        />
      ) : (
        <div className="flex justify-center items-center h-52">
          <div className="text-lg font-semibold">No image found</div>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 mt-2 h-22 overflow-hidden whitespace-nowrap overflow-ellipsis">
          {name}
        </h2>
        <p className="mt-2 text-gray-600">Price: ${price}</p>
        <p className="mt-2 text-gray-600">Max Guests: {maxGuests}</p>
        <p className="mt-2 text-gray-600">Rating: {rating} ★</p>
        {!hideDescription && <p className="mt-2 text-gray-600">Description: {description}</p>}
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
  hideDescription: PropTypes.bool.isRequired, 
};

export default VenueItem;
