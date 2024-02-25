import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useVenuesStore from '../stores/venuesStore'; // Corrected import
import { revokeVenueManagerStatus } from '../hooks/fetchUserBookings';
import VenueItem from '../components/venues/VenueItem'; // Assuming you're using VenueItem component

const ManagerProfilePage = () => {
    const navigate = useNavigate();
    const { user, token } = useAuthStore(state => state);
    const { fetchManagedVenues, venues } = useVenuesStore();

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

    useEffect(() => {
        if (user && user.name && token) {
          fetchManagedVenues(user.name, token);
        }
      }, [user, token, fetchManagedVenues]);

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Manager Profile</h1>
            <button onClick={handleRevokeManager} className="btn btn-warning">Revoke Venue Manager Status</button>
            <Link to="/create-venue" className="btn btn-primary ml-4">Add New Venue</Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue) => (
            <VenueItem
              key={venue.id}
              data={venue}
              showActions={true}
              onDeleteClick={() => fetchManagedVenues(user.name, token)}
            />
            ))}
            </div>

            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
};

export default ManagerProfilePage;
