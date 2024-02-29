//project-exam-2-holidaze/src/pages/ProfilePage.jsx
import React, { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useBookingsStore from '../stores/bookingsStore';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

function ProfilePage() {
    const { user, token } = useAuthStore((state) => ({
        user: state.user,
        token: state.token,
    }));
    const { bookings, fetchUserBookings, deleteBooking, isLoading, error } = useBookingsStore((state) => ({
        bookings: state.bookings,
        fetchUserBookings: state.fetchUserBookings,
        deleteBooking: state.deleteBooking,
        isLoading: state.isLoading,
        error: state.error,
    }));

    useEffect(() => {
        if (token && user?.name) {
            fetchUserBookings(user.name, token);
        }
    }, [user?.name, token, fetchUserBookings]); // fetchUserBookings added as a dependency

    // Handler for deleting bookings and refreshing the list
    const handleDeleteBooking = async (bookingId) => {
        await deleteBooking(bookingId);
        if (user?.name && token) {
            fetchUserBookings(user.name, token); // Re-fetch bookings to refresh the list
            console.log('Booking deleted successfully!'); // Log success message
        }
    };
    

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
                    <div key={booking.id} className="mb-4 p-2 border rounded shadow">
                        <div><strong>Booking ID:</strong> {booking.id}</div>
                        <div><strong>From:</strong> {formatDate(booking.dateFrom)}</div>
                        <div><strong>To:</strong> {formatDate(booking.dateTo)}</div>
                        <div><strong>Guests:</strong> {booking.guests}</div>
                        <div><strong>Booked on:</strong> {formatDate(booking.created)}</div>
                        <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete Booking
                        </button>
                    </div>
                ))
            ) : (
                <p>You have no bookings.</p>
            )}
        </div>
    );
}

export default ProfilePage;

