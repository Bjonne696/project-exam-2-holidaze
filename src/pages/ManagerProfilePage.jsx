import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { revokeVenueManagerStatus } from '../hooks/fetchUserBookings';

const ManagerProfilePage = () => {
    const navigate = useNavigate();
    const { token, user, setIsVenueManager } = useAuthStore();

    const mutation = useMutation({
        mutationFn: () => revokeVenueManagerStatus({ token, name: user?.name }),
        onSuccess: () => {
            setIsVenueManager(false);
            navigate('/profile');
        },
        onError: (error) => {
            console.error('Error revoking manager status:', error);
        },
    });

    const handleRevokeManager = () => {
        mutation.mutate();
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Manager Profile</h1>
            <button onClick={handleRevokeManager} className="btn btn-warning">Revoke Venue Manager Status</button>
            <Link to="/" className="text-blue-500">Return to Home</Link>
        </div>
    );
};

export default ManagerProfilePage;
