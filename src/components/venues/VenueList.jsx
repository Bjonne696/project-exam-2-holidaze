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
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(PropTypes.string).isRequired, // Confirming it expects an array of strings
  }).isRequired,
};
export default VenueList;
