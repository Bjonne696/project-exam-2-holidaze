// project-exam-2-holidaze/src/components/venues/VenueList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';

// Update the component to accept props
const VenueList = ({ venues, isLoading }) => {
  // Remove the useFetchVenues hook and its related logic

  if (!venues) {
    return <div>Loading venues...</div>; // Show a loading message or spinner
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col">
          <Link to={`/venue/${venue.id}`} className="no-underline">
            <VenueItem data={venue} />
          </Link>
        </div>
      ))}
      {isLoading && <div>Loading more venues...</div>}
    </div>
  );
};

VenueList.propTypes = {
  venues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    media: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    price: PropTypes.number,
    maxGuests: PropTypes.number,
  })),
  isLoading: PropTypes.bool // Optional, if you want to pass and handle loading state from HomePage
};

export default VenueList;