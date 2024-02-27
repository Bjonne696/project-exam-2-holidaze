// project-exam-2-holidaze/src/pages/HomePage.jsx

import React from 'react';
import { useFetchVenues } from '../hooks/useVenues'; // Ensure path is correct
import VenueList from "../components/venues/VenueList";
import VenueFilter from "../components/venues/VenueFilter";

const HomePage = () => {
    // useFetchVenues returns a query object from React Query
    const { data: venues, isLoading, error } = useFetchVenues();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto">
            {/* Ensure your components are correctly handling the venues data */}
            <VenueFilter venues={venues} />
            <VenueList venues={venues} />
        </div>
    );
};

export default HomePage;
