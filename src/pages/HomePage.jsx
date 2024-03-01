// project-exam-2-holidaze/src/pages/HomePage.jsx

import React from 'react';
import { useFetchVenues } from '../hooks/useVenuesApi'; // Adjust the import path as necessary
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
  // Use the React Query hook for fetching venues
  const { data: venues, isLoading, error } = useFetchVenues();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto">
      {/* Assuming VenueFilter can operate directly on venues data */}
      <VenueFilter venues={venues} />
      {/* VenueList no longer needs venues passed as props if it's using useFetchVenues internally */}
      <VenueList />
    </div>
  );
};

export default HomePage;
