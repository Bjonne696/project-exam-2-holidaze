import React, { useEffect } from 'react';

import useVenuesStore from '../stores/venuesStore';
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";


const HomePage = () => {
	const { venues, isLoading, error, fetchVenues } = useVenuesStore();
  
	useEffect(() => {
	  fetchVenues();
	}, [fetchVenues]);
  
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

