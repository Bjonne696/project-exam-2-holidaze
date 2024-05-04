import React, { useEffect } from 'react';
import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
  const { fetchAllVenues, venues, isLoading, error } = useVenuesStore(state => ({
    fetchAllVenues: state.fetchAllVenues,
    venues: state.venues,
    isLoading: state.isLoading,
    error: state.error
  }));

  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto">
      <VenueFilter venues={venues} />
      {/* Pass hideDescription prop as true */}
      <VenueList hideDescription={true} />
    </div>
  );
};

export default HomePage;