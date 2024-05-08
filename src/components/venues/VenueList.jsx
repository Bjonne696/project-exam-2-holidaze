import React from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';
import useVenuesStore from '../../stores/venuesStore';

const VenueList = ({ hideDescription }) => {
  const venues = useVenuesStore(state => state.venues);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col">
          <Link to={`/venue/${venue.id}`} className="no-underline">
            <VenueItem data={venue} hideDescription={hideDescription} />
          </Link>
        </div>
      ))}
    </div>
  );
};

VenueList.propTypes = {
  hideDescription: PropTypes.bool.isRequired,
};

export default VenueList;