import React, { useState } from 'react';
import { Card } from 'react-daisyui';
import PropTypes from 'prop-types';
import { StyledCard, StyledImage, StyledTitle, CardFlexContainer, StyledRating, StyledMaxGuests, StyledPrice } from "../styles/StyledVenues";

const VenueItem = ({ data, isDetailedView = false }) => {
  const { name, description, media, rating, maxGuests, price, created, updated, meta, location, owner, bookings } = data;
  const [imageError, setImageError] = useState(false); // Track if there's an error loading the image
  const imageSrc = media.length > 0 ? media[0] : null;

  const imageContent = imageSrc && !imageError ? (
    <StyledImage src={imageSrc} alt={name} onError={() => setImageError(true)} />
  ) : (
    <h2>No image found</h2> // Display this message if there's no image or if an error occurred
  );

  // For the detailed view without a Card
  if (isDetailedView) {
    return (
      <div>
        {imageContent}
        <h2>{name}</h2>
        <p>Description: {description}</p>
        <p>Rating: {rating} ★</p>
        <p>Max Guests: {maxGuests}</p>
        <p>Price: ${price}</p>
        <p>Created: {new Date(created).toLocaleDateString()}</p>
        <p>Updated: {new Date(updated).toLocaleDateString()}</p>
        {meta && (
          <div>
            <p>Meta Information:</p>
            {/* Assuming meta is an object with keys you want to display */}
            {Object.keys(meta).map(key => (
              <p key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${meta[key]}`}</p>
            ))}
          </div>
        )}
        {location && (
          <div>
            <p>Location:</p>
            <p>Address: {location.address}</p>
            <p>City: {location.city}</p>
            <p>Zip: {location.zip}</p>
            <p>Country: {location.country}</p>
            {/* Add more location details if available */}
          </div>
        )}
        {owner && (
          <div>
            <p>Owner:</p>
            <p>Name: {owner.name}</p>
            <p>Email: {owner.email}</p>
            {/* Display more owner details if available */}
          </div>
        )}
        {bookings && bookings.length > 0 && (
          <div>
            <p>Bookings:</p>
            {bookings.map((booking, index) => (
              <p key={index}>From: {new Date(booking.dateFrom).toLocaleDateString()} To: {new Date(booking.dateTo).toLocaleDateString()}, Guests: {booking.guests}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // For the summary view in a Card
  return (
    <StyledCard>
      {imageContent}
      <Card.Body>
        <StyledTitle>{name}</StyledTitle>
        <StyledRating>{rating} ★</StyledRating>
        <StyledMaxGuests>Max Guests: {maxGuests}</StyledMaxGuests>
        <StyledPrice>${price}</StyledPrice>
      </Card.Body>
    </StyledCard>
  );
};

VenueItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    media: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    maxGuests: PropTypes.number,
    price: PropTypes.number,
    created: PropTypes.string,
    updated: PropTypes.string,
    meta: PropTypes.object,
    location: PropTypes.object,
    owner: PropTypes.object,
    bookings: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  isDetailedView: PropTypes.bool,
};

export default VenueItem;