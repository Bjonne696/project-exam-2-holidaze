// project-exam-2-hollidaze/src/pages/ManagerProfilePage.jsx

import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useFetchManagedVenues } from '../hooks/useVenues'; // Ensure correct path
import { revokeVenueManagerStatus } from '../hooks/fetchUserBookings';
import VenueItem from '../components/venues/VenueItem';

const ManagerProfilePage = () => {
    const navigate = useNavigate();
    const { user, token } = useAuthStore(state => state);

    // Adjusted to use the React Query hook correctly
    const { data: venues, isLoading } = useFetchManagedVenues(user?.name, token);

    const mutation = useMutation({
        mutationFn: () => revokeVenueManagerStatus({ token, name: user?.name }),
        onSuccess: () => {
            navigate('/profile');
        },
        onError: (error) => {
            console.error('Error revoking manager status:', error);
        },
    });

    const handleRevokeManager = () => {
        mutation.mutate();
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Manager Profile</h1>
            <button onClick={handleRevokeManager} className="btn btn-warning">Revoke Venue Manager Status</button>
            <Link to="/create-venue" className="btn btn-primary ml-4">Add New Venue</Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venues?.map((venue) => (
                    <VenueItem
                        key={venue.id}
                        data={venue}
                        showActions={true}
                    />
                ))}
            </div>

            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
};

export default ManagerProfilePage;
