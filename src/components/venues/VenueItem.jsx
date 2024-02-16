import React from 'react'; // Ensure React is imported when using JSX
import { Card } from 'react-daisyui';
import PropTypes from 'prop-types';
import { StyledCard, StyledImage, StyledTitle, StyledDescription } from "../styles/StyledVenues";


function VenueItem({ data }) {
  const { name, description, media } = data;
  const image = media.length > 0 ? media[0] : '';

  return (
    <StyledCard imageFull>
      <StyledImage src={image} alt={name} loading="lazy" />
      <Card.Body>
        <StyledTitle tag="h2">{name}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </Card.Body>
    </StyledCard>
  );
}

VenueItem.propTypes = {
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      media: PropTypes.arrayOf(PropTypes.string).isRequired, // Updated to expect an array of strings
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

export default VenueItem;


