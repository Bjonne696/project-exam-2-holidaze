// project-exam-2-holidaze/src/components/venues/VenueList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import { useFetchVenues } from '../../hooks/useVenuesApi'; // Adjust the import to your file structure
import PropTypes from 'prop-types';

const VenueList = () => {
  const { data: venues, isLoading, isError, error } = useFetchVenues();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col">
          <Link to={`/venue/${venue.id}`} className="no-underline">
            <VenueItem data={venue} />
          </Link>
        </div>
      ))}
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
};

export default VenueList;