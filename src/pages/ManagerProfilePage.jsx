import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { revokeVenueManagerStatus } from '../hooks/fetchUserBookings'; // Assuming this is the correct import


const ManagerProfilePage = () => {
    const { token, setIsVenueManager } = useAuthStore(state => ({
        token: state.token,
        setIsVenueManager: state.setIsVenueManager,
    }));
    const navigate = useNavigate();

    // Assuming revokeVenueManagerStatus is similar to becomeVenueManager but sets venueManager to false
    const mutation = useMutation(() => revokeVenueManagerStatus({ token }), {
        onSuccess: () => {
            // Update local state to reflect the user is no longer a venue manager
            setIsVenueManager(false);
            // Redirect to profile page or home page as appropriate
            navigate('/profile'); // Assuming you have a profile page route
        },
    });

    const handleRevokeManager = () => {
        mutation.mutate();
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Manager</h1>
            {/* Manager-specific UI elements */}
            <button onClick={handleRevokeManager} className="btn btn-warning">Revoke Venue Manager Status</button>
            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
};

export default ManagerProfilePage;