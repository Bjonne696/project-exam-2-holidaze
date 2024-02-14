import React from 'react';
import PropTypes from 'prop-types';
import VenueDetail from "./VenueDetail";

function VenueList({ venues }) {
    return (
        <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {venues.map((venue) => {
                // Destructure directly from the venue object based on the API's structure
                const { id, name, media, description, price, maxGuests, rating, location } = venue;
                return (
                    <div key={id} className="flex flex-col">
                        {/* Adjusted props to match API structure and VenueDetail's expected props */}
                        <VenueDetail
                            title={name}
                            image={media.length > 0 ? media[0].url : undefined} // Assuming the first media item is the image you want to display
                            description={description}
                            price={price}
                            maxGuests={maxGuests}
                            rating={rating}
                            location={location}
                        />
                    </div>
                );
            })}
        </div>
    );
}

// Adjust PropTypes to reflect the correct structure
VenueList.propTypes = {
    venues: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            media: PropTypes.array.isRequired, // Adjusted for media being an array
            description: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            maxGuests: PropTypes.number.isRequired,
            rating: PropTypes.number.isRequired,
            location: PropTypes.shape({
                address: PropTypes.string.isRequired,
                city: PropTypes.string.isRequired,
            }).isRequired,
        })
    ),
};

export default VenueList;
