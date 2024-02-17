import React from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import PropTypes from 'prop-types';
import { VenueGrid, VenueWrapper } from '../styles/StyledVenues';

const VenueList = ({ venues }) => {
  return (
    <VenueGrid>
      {venues.map(venue => (
        <VenueWrapper key={venue.id}>
          <Link to={`/venue/${venue.id}`} style={{ textDecoration: 'none' }}>
            <VenueItem data={venue} summary={true} />
          </Link>
        </VenueWrapper>
      ))}
    </VenueGrid>
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
