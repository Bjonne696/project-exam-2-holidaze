// project-exam-2-hollidaze/src/components/venues/VenueList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';

const VenueList = ({ venues }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> {/* Adjusted for Tailwind CSS grid */}
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col"> {/* This div replaces VenueWrapper */}
          <Link to={`/venue/${venue.id}`} className="no-underline"> {/* Tailwind CSS class for no underline */}
            <VenueItem data={venue} summary={true} />
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
  })).isRequired,
};

export default VenueList;
