import React from 'react';
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';
import { VenueGrid, VenueWrapper } from '../styles/StyledVenues';

function VenueList({ venues = [] }) {
  return (
    <VenueGrid>
      {venues.map((venue) => (
        <VenueWrapper key={venue.id}>
          <VenueItem data={venue} />
        </VenueWrapper>
      ))}
    </VenueGrid>
  );
}

VenueList.propTypes = {
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      media: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default VenueList;