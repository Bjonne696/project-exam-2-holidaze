import React from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchUserBookings } from '../hooks/fetchUserBookings';
import useAuthStore, { decodeToken } from '../stores/authStore';

function ProfilePage() {
    const { token } = useAuthStore(state => ({ token: state.token }));
    const decodedToken = token ? decodeToken(token) : null;
    const name = decodedToken ? decodedToken.name : null;

    const { data: bookings, error, isLoading } = useQuery({
        queryKey: ['bookings', name], // Use the name variable here
        queryFn: () => fetchUserBookings(name, token), // And here
        enabled: !!name && !!token,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        <p>Date From: {new Date(booking.dateFrom).toLocaleDateString()}</p>
                        <p>Date To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                        {/* Display other booking details */}
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
}

export default ProfilePage;