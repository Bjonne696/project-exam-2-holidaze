import React, { useState, useEffect } from 'react';
import { useFetchUserBookings, useDeleteBooking } from '../hooks/useBookingsApi';
import useAuthStore from '../stores/authStore';
import { useBecomeVenueManager, useRevokeVenueManagerStatus, useUpdateProfileMedia } from '../hooks/useAuthHooks';

// Define the ProfilePage functional component
const ProfilePage = () => {
  // Extract user and token from global state
  const { user, token, setUser } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    setUser: state.setUser,
  }));

  // Define state variables and mutation functions for avatar update and venue manager status
  const [newAvatar, setNewAvatar] = useState('');
  const updateAvatarMutation = useUpdateProfileMedia();
  const revokeManagerStatusMutation = useRevokeVenueManagerStatus(); 

  // Fetch user bookings and define mutation function for booking deletion
  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useFetchUserBookings({ userName: user?.name, token });
  const deleteBookingMutation = useDeleteBooking();
  const becomeVenueManagerMutation = useBecomeVenueManager();

  //  Handle avatar change
  const handleAvatarChange = (e) => setNewAvatar(e.target.value);

  //  Handle avatar submission
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

  //  Handle booking deletion
  const handleDeleteBooking = (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;
    
    deleteBookingMutation.mutate(bookingId, {
      onSuccess: () => {
        alert('Booking deleted successfully');
      },
      onError: (error) => {
        alert(`Failed to delete booking: ${error.message}`);
      },
    });
  };

  //  Handle becoming a venue manager
  const handleBecomeVenueManagerClick = () => {
    becomeVenueManagerMutation.mutate(null, {
      onSuccess: (updatedUser) => {
        alert('You are now a venue manager');
        setUser(updatedUser);
      },
    });
  };

  //  Handle revoking venue manager status
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

  //  Display loading state while fetching bookings
  if (isLoadingBookings) return <div>Loading bookings...</div>;
  //  Display error message if fetching bookings fails
  if (bookingsError) return <div>Error: {bookingsError.message}</div>;

  //  Define styles
  const buttonStyle = "rounded-full text-center px-4 py-2 bg-green-300 hover:bg-green-400 text-black";
  const buttonStyleRed = "rounded-full text-center px-4 py-2 bg-red-500 hover:bg-red-600 text-black";
  const buttonStyleDelete = "rounded-full text-center px-4 py-2 bg-red-500 hover:bg-red-600 text-black";
  const cardStyle = "p-4 rounded shadow-sm bg-amber-200"; 

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
      {/*  Display buttons for becoming a venue manager or revoking manager status */}
      {!user?.venueManager ? (
        <button onClick={handleBecomeVenueManagerClick} className={`btn ${buttonStyle} btn my-4`}>Become Venue Manager</button>
      ) : (
        <button onClick={handleRevokeManagerStatusClick} className={`btn ${buttonStyleRed} btn-danger my-4`}>Revoke Manager Status</button>
      )}
  
      <h2 className="text-lg font-bold mt-4">Your Bookings</h2>
      <div className="space-y-4">
        {bookings && bookings.length > 0 ? (
          //  Display user bookings
          bookings.map((booking) => (
            <div key={booking.id} className={cardStyle}> 
              <p><strong>Venue:</strong> {booking.venue?.name}</p>
              <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              {/* Button to delete booking */}
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

// Export the ProfilePage component
export default ProfilePage;
