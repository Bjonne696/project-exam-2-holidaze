//project-exam-2-holidaze/src/pages/ProfilePage.jsx
import React, { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useBookingsStore from '../stores/bookingsStore';

// Ensure the formatDate function is defined within the same file and before it's used
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

function ProfilePage() {
    const { user, token } = useAuthStore((state) => ({
        user: state.user,
        token: state.token,
    }));
    const { bookings, fetchUserBookings, isLoading, error } = useBookingsStore((state) => ({
        bookings: state.bookings,
        fetchUserBookings: state.fetchUserBookings,
        isLoading: state.isLoading,
        error: state.error,
    }));

    useEffect(() => {
        if (token && user?.name) {
            fetchUserBookings(user.name, token);
        }
    }, [user?.name, token]);

    if (isLoading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold">Profile Page</h1>
            <div>Name: {user?.name}</div>
            <div>Email: {user?.email}</div>

            <h2 className="text-lg font-bold mt-4">Your Bookings</h2>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id} className="mb-4 p-2 border rounded">
                        <div><strong>Booking ID:</strong> {booking.id}</div>
                        <div><strong>From:</strong> {formatDate(booking.dateFrom)}</div>
                        <div><strong>To:</strong> {formatDate(booking.dateTo)}</div>
                        <div><strong>Guests:</strong> {booking.guests}</div>
                        <div><strong>Booked on:</strong> {formatDate(booking.created)}</div>
                    </div>
                ))
            ) : (
                <p>You have no bookings.</p>
            )}
        </div>
    );
}

export default ProfilePage;
