// project-exam-2-holidaze/src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
  // Extracting state variables and actions from the Zustand store
  const { fetchAllVenues, venues, isLoading, error } = useVenuesStore(state => ({
    fetchAllVenues: state.fetchAllVenues,
    venues: state.venues,
    isLoading: state.isLoading,
    error: state.error
  }));

  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]); // Dependency array includes fetchAllVenues to ensure it's called once

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto">
      {/* Assuming VenueFilter can handle an empty or undefined venues array gracefully */}
      <VenueFilter venues={venues} />
      <VenueList />
    </div>
  );
};

export default HomePage;