// project-exam-2-holidaze/src/components/venues/VenueList.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import VenueItem from './VenueItem';
import useVenuesStore from '../../stores/venuesStore'; // Ensure correct path
import PropTypes from 'prop-types';

const VenueList = () => {
  const { fetchVenues, venues, isLoading } = useVenuesStore();
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        fetchVenues();
      }
    }, { threshold: 1 });

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    // Return a cleanup function
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchVenues]);

  // Render JSX outside of useEffect
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex flex-col">
          <Link to={`/venue/${venue.id}`} className="no-underline">
            <VenueItem data={venue} />
          </Link>
        </div>
      ))}
      <div ref={loaderRef} className="loading-ref">{isLoading && <p>Loading more venues...</p>}</div>
    </div>
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
