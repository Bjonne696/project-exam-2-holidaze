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
  const revokeManagerStatusMutation = useRevokeVenueManagerStatus(); 

  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useFetchUserBookings({ userName: user?.name, token });
  const deleteBookingMutation = useDeleteBooking();
  const becomeVenueManagerMutation = useBecomeVenueManager();

  const handleAvatarChange = (e) => setNewAvatar(e.target.value);

  const handleSubmitAvatar = () => {
    if (!newAvatar.trim()) {
      alert('Please enter a valid avatar URL.');
      return;
    }
  
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
      onError: (error) => {
        alert(`Failed to revoke manager status: ${error.message}`);
      },
    });
  };

  if (isLoadingBookings) return <div>Loading bookings...</div>;
  if (bookingsError) return <div>Error: {bookingsError.message}</div>;

  const buttonStyle = "rounded-full text-center px-4 py-2 bg-green-300 hover:bg-green-400 text-black";

  const buttonStyleRed = "rounded-full text-center px-4 py-2 bg-red-500 hover:bg-red-600 text-black";
  
  const buttonStyleDelete = "rounded-full text-center px-4 py-2 bg-red-500 hover:bg-red-600 text-black";
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Profile Page</h1>
        {user?.avatar && <img src={user.avatar} alt="User Avatar" className="rounded-full w-24 h-24 mb-4 sm:mb-0" />}
      </div>
  
      <div className="mb-4">Name: {user?.name}</div>
      <div className="mb-4">Email: {user?.email}</div>
  
      <div className="mb-4">
        <input type="text" value={newAvatar} onChange={handleAvatarChange} placeholder="New Avatar URL" className="input input-bordered w-full" />
        <button onClick={handleSubmitAvatar} className={`btn ${buttonStyle} mt-2`}>Update Avatar</button>
      </div>
      {!user?.venueManager ? (
        <button onClick={handleBecomeVenueManagerClick} className={`btn ${buttonStyle} btn my-4`}>Become Venue Manager</button>
      ) : (
        <button onClick={handleRevokeManagerStatusClick} className={`btn ${buttonStyleRed} btn-danger my-4`}>Revoke Manager Status</button>
      )}
  
      <h2 className="text-lg font-bold mt-4">Your Bookings</h2>
      <div className="space-y-4">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded shadow-sm">
              <p><strong>Venue:</strong> {booking.venue?.name}</p>
              <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <button onClick={() => handleDeleteBooking(booking.id)} className={`btn ${buttonStyleDelete}`}>Delete Booking</button>
            </div>
          ))
        ) : (
          <p>You have no bookings.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;