import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import VenueItem from './VenueItem';
import useVenuesStore from '../../stores/venuesStore';

/**
 * VenueList component displays a list of venues.
 * @param {boolean} hideDescription - Flag to hide description in VenueItem.
 */
const VenueList = ({ hideDescription }) => {
  const venues = useVenuesStore(state => state.venues); // Fetch venues from the store

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col">
          <Link to={`/venue/${venue.id}`} className="no-underline">
            {/* Passing each venue data and hideDescription prop to VenueItem */}
            <VenueItem data={venue} hideDescription={hideDescription} />
          </Link>
        </div>
      ))}
    </div>
  );
};

VenueList.propTypes = {
  hideDescription: PropTypes.bool.isRequired, // Ensure hideDescription prop is provided and is boolean
};

export default VenueList;
