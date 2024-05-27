import React, { useEffect } from 'react';
import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
  // Extracting variables and functions from the store
  const { fetchAllVenues, venues, isLoading, error } = useVenuesStore(state => ({
    fetchAllVenues: state.fetchAllVenues,
    venues: state.venues,
    isLoading: state.isLoading,
    error: state.error
  }));

  // Fetch venues when component mounts
  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]);

  // Render loading spinner while fetching
  if (isLoading) return <div>Loading...</div>;
  // Render error message if there's an error
  if (error) return <div>Error: {error.message}</div>;

  // Render VenueFilter and VenueList if there are no errors and not loading
  return (
    <div className="container mx-auto">
      <VenueFilter venues={venues} />
      <VenueList hideDescription={true} />
    </div>
  );
};

export default HomePage;