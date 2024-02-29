//project-exam-2-holidaze/src/pages/ProfilePage.jsx

import React, { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useBookingsStore from '../stores/bookingsStore';

function ProfilePage() {
    const { user, token } = useAuthStore((state) => ({
        user: state.user,
        token: state.token,
    }));
    const { bookings, fetchUserBookings, isLoading, error } = useBookingsStore();

    useEffect(() => {
        // Make sure user and token are available
        if (token && user?.name) {
            fetchUserBookings(user.name, token); // Pass user name and token explicitly if needed
        }
    }, [user?.name, token]);

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