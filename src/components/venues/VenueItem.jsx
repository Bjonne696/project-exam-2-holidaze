import React from 'react'; // Ensure React is imported when using JSX
import { Card } from 'react-daisyui';
import PropTypes from 'prop-types';

function VenueItem({ data }) {
  // Assuming the first media item is the primary image for the venue
  const { name, description, media } = data;
  const image = media.length > 0 ? media[0].url : ''; // Fallback to an empty string if no media

  return (
    <Card imageFull className="flex-auto">
      <Card.Image src={image} alt={name} />
      <Card.Body>
        <Card.Title tag="h2" className="text-white">
          {name}
        </Card.Title>
        <p className="text-white">{description}</p>
      </Card.Body>
    </Card>
  );
}

export default VenueItem;

VenueItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};
