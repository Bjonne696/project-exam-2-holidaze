// project-exam-2-holidaze/src/pages/MangerProfilePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useVenuesStore from '../stores/venuesStore';
import VenueItem from '../components/venues/VenueItem'; // Assuming you're using VenueItem component
import { Link } from 'react-router-dom';

function ManagerProfilePage() {
    const navigate = useNavigate();
    const { user, token, revokeVenueManagerStatus, setIsVenueManager } = useAuthStore();
    const { fetchManagedVenues, venues } = useVenuesStore();

    // Handler to revoke venue manager status
    const handleRevokeManager = async () => {
        if (user?.name) {
            try {
                await revokeVenueManagerStatus({ name: user.name }); // Corrected function call
                setIsVenueManager(false); // Update venue manager status in Zustand store
                console.log("Venue manager status revoked.");
                navigate('/profile'); // Navigate to profile page upon success
            } catch (error) {
                console.error('Error revoking manager status:', error);
            }
        }
    };

    useEffect(() => {
        if (user?.name && token) {
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
                        onDeleteClick={() => fetchManagedVenues(user?.name, token)} // Refresh the list after deletion
                    />
                ))}
            </div>

            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
}

export default ManagerProfilePage;