import React from 'react'; // Ensure React is imported when using JSX
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';

function VenueList({ venues = [] }) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
      {venues.map((venue) => (
        <div key={venue.id} className="flex flex-col">
          <VenueItem data={venue} />
        </div>
      ))}
    </div>
  );
}

VenueList.propTypes = {
	venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      media: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          alt: PropTypes.string,
        })
      ).isRequired,
      price: PropTypes.number,
      maxGuests: PropTypes.number,
      rating: PropTypes.number,
      created: PropTypes.string,
      updated: PropTypes.string,
      meta: PropTypes.object,
      location: PropTypes.object,
      owner: PropTypes.object,
      bookings: PropTypes.arrayOf(PropTypes.object),
      _count: PropTypes.object,
    })
  ),
};

export default VenueList;
