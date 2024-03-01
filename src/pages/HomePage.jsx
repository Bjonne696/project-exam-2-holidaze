// project-exam-2-holidaze/src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
  const fetchAllVenues = useVenuesStore((state) => state.fetchAllVenues);
  const venues = useVenuesStore((state) => state.venues);
  const isLoading = useVenuesStore((state) => state.isLoading);
  const error = useVenuesStore((state) => state.error);

  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto">
      <VenueFilter venues={venues} />
      <VenueList />
    </div>
  );
};

export default HomePage;
