import React from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUserBookings, becomeVenueManager } from '../hooks/fetchUserBookings';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { token, user, setIsVenueManager } = useAuthStore(state => ({
        token: state.token,
        user: state.user,
        setIsVenueManager: state.setIsVenueManager,
    }));
    const navigate = useNavigate();

    // Updated useQuery call for React Query v5
    const { data: bookings, error, isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => fetchUserBookings(token),
        enabled: !!token,
    });

    // Updated useMutation call for React Query v5
    const mutation = useMutation({
        mutationFn: () => becomeVenueManager({ token, name: user?.name }),
        onSuccess: () => {
            setIsVenueManager(true);
            navigate('/manager-profile');
        },
    });

    const handleBecomeManager = () => {
        mutation.mutate();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        <p>Date From: {new Date(booking.dateFrom).toLocaleDateString()}</p>
                        <p>Date To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                        {/* Additional booking details can be displayed here */}
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}
            <button onClick={handleBecomeManager} className="btn btn-primary">Become Venue Manager</button>
        </div>
    );
}

export default ProfilePage;
