import React from 'react'; // Ensure React is imported when using JSX
import { Card } from 'react-daisyui';
import PropTypes from 'prop-types';

function VenueItem({ data }) {
  // Assuming the first media item is the primary image for the venue
  const { name, description, media } = data;
  // Directly use the first item of media assuming it's a URL string
  const image = media.length > 0 ? media[0] : ''; // No need for .url since media is an array of strings

  return (
    <Card imageFull className="flex-auto">
      <Card.Image src={image} alt={name} className="object-cover" loading="lazy" /> {/* Ensure object-fit and lazy loading */}
      <Card.Body>
        <Card.Title tag="h2" className="text-white">
          {name}
        </Card.Title>
        <p className="text-white">{description}</p>
      </Card.Body>
    </Card>
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


