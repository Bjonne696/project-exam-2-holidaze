import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import VenueItem from '../components/venues/VenueItem';
import { BASE_URL } from '../constants/apiVenues';

const VenuePage = () => {
	const { id } = useParams();
	const { data: venue, isLoading, error } = useFetch(`${BASE_URL}/${id}`);
  
	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
  
	return venue ? <VenueItem data={venue} isDetailedView={true} /> : <p>Venue not found.</p>;
  };
  
export default VenuePage;