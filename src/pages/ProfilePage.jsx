//project-exam-2-holidaze/src/pages/ProfilePage.jsx

import React from 'react';
import { useFetchUserBookings, useDeleteBooking } from '../hooks/useBookingsApi';
import useAuthStore from '../stores/authStore';
import { useBecomeVenueManager, useRevokeVenueManagerStatus } from '../hooks/useAuthHooks';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

function ProfilePage() {
  const { user, token, logoutUser, setUser } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    logoutUser: state.logoutUser,
    setUser: state.setUser, // Ensure you have a setUser method to update user state
  }));
  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useFetchUserBookings({ userName: user?.name, token });
  const { mutate: deleteBooking } = useDeleteBooking();
  const { mutate: becomeVenueManager, isError: isBecomeManagerError, error: becomeManagerError } = useBecomeVenueManager();
  const { mutate: revokeManagerStatus, isError: isRevokeManagerError, error: revokeManagerError } = useRevokeVenueManagerStatus();

  const handleBecomeVenueManagerClick = () => {
    becomeVenueManager({}, {
      onSuccess: (updatedUser) => {
        console.log('You are now a venue manager');
        setUser(updatedUser); // Update user state to reflect the new venue manager status
      },
    });
  };

  const handleRevokeManagerStatusClick = () => {
    revokeManagerStatus({}, {
      onSuccess: (updatedUser) => {
        console.log('Venue manager status revoked.');
        setUser(updatedUser); // Update user state to reflect the revocation of venue manager status
      },
    });
  };

  if (isLoadingBookings) return <div>Loading bookings...</div>;
  if (bookingsError) return <div>Error: {bookingsError.message}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold">Profile Page</h1>
      <div>Name: {user?.name}</div>
      <div>Email: {user?.email}</div>

      {/* Error handling for becoming/rejecting venue manager */}
      {isBecomeManagerError && <p className="text-red-500">Error: {becomeManagerError.message}</p>}
      {isRevokeManagerError && <p className="text-red-500">Error: {revokeManagerError.message}</p>}

      {!user?.venueManager && (
        <button
          onClick={handleBecomeVenueManagerClick}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Become Venue Manager
        </button>
      )}

      {user?.venueManager && (
        <button
          onClick={handleRevokeManagerStatusClick}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Revoke Manager Status
        </button>
      )}

      <h2 className="text-lg font-bold mt-4">Your Bookings</h2>
      {bookings?.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id} className="mb-4 p-2 border rounded shadow">
            <div><strong>Booking ID:</strong> {booking.id}</div>
            <div><strong>From:</strong> {formatDate(booking.dateFrom)}</div>
            <div><strong>To:</strong> {formatDate(booking.dateTo)}</div>
            <div><strong>Guests:</strong> {booking.guests}</div>
            <div><strong>Booked on:</strong> {formatDate(booking.created)}</div>
            <button 
              onClick={() => deleteBooking(booking.id)}
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