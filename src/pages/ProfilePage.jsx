//project-exam-2-holidaze/src/pages/ProfilePage.jsx

import React, { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useBookingsStore from '../stores/bookingsStore';

function ProfilePage() {
    const { user, token } = useAuthStore();
    const { bookings, fetchUserBookings, isLoading, error } = useBookingsStore();

    useEffect(() => {
        // Ensure both user and token are available before fetching
        if (token && user?.name) {
            fetchUserBookings();
        }
    }, [token, user?.name, fetchUserBookings]);

    if (isLoading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Profile Page</h1>
            {/* Display user info */}
            <div>Name: {user?.name}</div>
            <div>Email: {user?.email}</div>

            {/* List bookings */}
            <h2 className="text-lg font-bold mt-4">Your Bookings</h2>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        {/* Display booking details */}
                    </div>
                ))
            ) : (
                <p>You have no bookings.</p>
            )}


        </div>
    );
}

export default ProfilePage;