// project-exam-2-holidaze/src/pages/MangerProfilePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useFetchManagedVenues } from '../hooks/useVenuesApi'; // Import your React Query hooks
import { useRevokeVenueManagerStatus } from '../hooks/useAuthHooks'; // Import your React Query hooks
import VenueItem from '../components/venues/VenueItem';
import { Link } from 'react-router-dom';

function ManagerProfilePage() {
    const navigate = useNavigate();
    const { user, token } = useAuthStore((state) => ({ user: state.user, token: state.token }));
    const { data: venues, refetch: refetchManagedVenues } = useFetchManagedVenues(user?.name, token); // Assuming this hook is implemented
    const { mutate: revokeManagerStatus } = useRevokeVenueManagerStatus(); // Assuming this hook is implemented

    // Handler to revoke venue manager status
    const handleRevokeManager = () => {
        revokeManagerStatus({ name: user.name }, {
            onSuccess: () => {
                console.log("Venue manager status revoked.");
                // Update the user state if needed, e.g., setUser(updatedUser);
                navigate('/profile'); // Navigate to profile page upon success
            },
            onError: (error) => {
                console.error('Error revoking manager status:', error);
            }
        });
    };

    useEffect(() => {
        if (user?.name && token) {
            refetchManagedVenues(); // Use refetch from useFetchManagedVenues hook
        }
    }, [user, token, refetchManagedVenues]);

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
                        onDeleteClick={refetchManagedVenues} // Assuming deletion logic is handled elsewhere and here we just refetch
                    />
                ))}
            </div>

            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
}

export default ManagerProfilePage;
