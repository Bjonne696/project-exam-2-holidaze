//project-exam-2-holidaze/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useFetchUserBookings, useDeleteBooking } from '../hooks/useBookingsApi';
import useAuthStore from '../stores/authStore';
import { useBecomeVenueManager, useRevokeVenueManagerStatus, useUpdateProfileMedia } from '../hooks/useAuthHooks';

const ProfilePage = () => {
  const { user, token, setUser } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    setUser: state.setUser,
  }));

  const [newAvatar, setNewAvatar] = useState('');
  const updateAvatarMutation = useUpdateProfileMedia();

  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useFetchUserBookings({ userName: user?.name, token });
  const deleteBookingMutation = useDeleteBooking();
  const becomeVenueManagerMutation = useBecomeVenueManager();
  const revokeManagerStatusMutation = useRevokeVenueManagerStatus();

  const handleAvatarChange = (e) => setNewAvatar(e.target.value);

  const handleSubmitAvatar = () => {
    updateAvatarMutation.mutate({ avatar: newAvatar }, {
      onSuccess: (data) => {
        alert('Avatar updated successfully');
        setUser(data);
      },
      onError: (error) => {
        alert(`Failed to update avatar: ${error.message}`);
      },
    });
  };

  const handleDeleteBooking = (bookingId) => {
    deleteBookingMutation.mutate(bookingId, {
      onSuccess: () => {
        alert('Booking deleted successfully');
        // Optionally, refresh bookings list here
      },
      onError: (error) => {
        alert(`Failed to delete booking: ${error.message}`);
      },
    });
  };

  const handleBecomeVenueManagerClick = () => {
    becomeVenueManagerMutation.mutate(null, {
      onSuccess: (updatedUser) => {
        alert('You are now a venue manager');
        setUser(updatedUser);
      },
    });
  };

  const handleRevokeManagerStatusClick = () => {
    revokeManagerStatusMutation.mutate(null, {
      onSuccess: (updatedUser) => {
        alert('Venue manager status revoked.');
        setUser(updatedUser);
      },
    });
  };

  if (isLoadingBookings) return <div>Loading bookings...</div>;
  if (bookingsError) return <div>Error: {bookingsError.message}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile Page</h1>
        {user?.avatar && <img src={user.avatar} alt="User Avatar" className="rounded-full w-12 h-12" />}
      </div>

      <div>Name: {user?.name}</div>
      <div>Email: {user?.email}</div>

      <input type="text" value={newAvatar} onChange={handleAvatarChange} placeholder="New Avatar URL" className="input input-bordered" />
      <button onClick={handleSubmitAvatar} className="btn">Update Avatar</button>

      {!user?.venueManager ? (
        <button onClick={handleBecomeVenueManagerClick} className="btn btn-primary">Become Venue Manager</button>
      ) : (
        <button onClick={handleRevokeManagerStatusClick} className="btn btn-danger">Revoke Manager Status</button>
      )}

<h2 className="text-lg font-bold mt-4">Your Bookings</h2>
{bookings && bookings.length > 0 ? (
  bookings.map((booking) => (
    <div key={booking.id} className="mb-4 p-2 border rounded shadow">
      <p><strong>Venue:</strong> {booking.venue.name}</p> {/* Accessing venue name */}
      <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleString()}</p>
      <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleString()}</p>
      <p><strong>Guests:</strong> {booking.guests}</p>
      <button onClick={() => handleDeleteBooking(booking.id)} className="btn btn-danger">Delete Booking</button>
    </div>
  ))
) : (
  <p>You have no bookings.</p>
)}
    </div>
  );
};

export default ProfilePage;