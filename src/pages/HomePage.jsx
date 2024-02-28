// project-exam-2-holidaze/src/pages/HomePage.jsx

import React, { useEffect } from 'react';

import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";


const HomePage = () => {
	const { venues, isLoading, error, fetchVenues, resetVenues } = useVenuesStore();
  
	useEffect(() => {
	  resetVenues(); // Reset the state before fetching
	  fetchVenues();
	  // Ensure fetchVenues and resetVenues are included in the dependency array if they are wrapped in useCallback or might change
	}, [fetchVenues, resetVenues]);
  
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
  
	return (
	  <div className="container mx-auto">
		<VenueFilter venues={venues} />
		<VenueList venues={venues} />
	  </div>
	);
  };
  
  export default HomePage;
