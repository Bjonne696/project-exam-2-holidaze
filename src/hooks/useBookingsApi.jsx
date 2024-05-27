import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore';

// Function to fetch bookings for a specific venue
const fetchBookingsForVenue = async (venueId, token) => {
  const response = await fetch(`${BASE_URL}/venues/${venueId}?_bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch bookings for the venue');
  return response.json();
};

// Function to fetch bookings associated with a specific user
const fetchUserBookings = async (userName, token) => {
  const response = await fetch(`${BASE_URL}/profiles/${userName}/bookings?_venue=true`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message || "Failed to fetch user bookings");
  }
  return response.json();
};

// Function to create a new booking
const createBooking = async (bookingData, token) => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
};

// Function to update an existing booking
const updateBooking = async (bookingId, updateData, token) => {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error('Failed to update booking');
  return response.json();
};

// Function to delete a booking
const deleteBooking = async (bookingId, token) => {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete booking');
  return response.ok; 
};

// Custom hook to fetch bookings for a venue
export const useFetchBookingsForVenue = ({ venueId, token }) => {
  return useQuery({
    queryKey: ['bookingsForVenue', venueId],
    queryFn: () => fetchBookingsForVenue(venueId, token),
    enabled: !!venueId && !!token,
  });
};

// Custom hook to fetch user bookings
export const useFetchUserBookings = ({ userName, token }) => {
  return useQuery({
    queryKey: ['userBookings', userName],
    queryFn: () => fetchUserBookings(userName, token),
    enabled: !!userName && !!token,
  });
};

// Custom hook to create a booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token); 
 
  return useMutation({
    mutationFn: (newBooking) => createBooking(newBooking, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookingsForVenue']);
      queryClient.invalidateQueries(['userBookings']);
    },
  });
};

// Custom hook to update a booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  return useMutation({
    mutationFn: ({ bookingId, updateData }) => updateBooking(bookingId, updateData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsForVenue'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};

// Custom hook to delete a booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token'); 

  return useMutation({
    mutationFn: (bookingId) => deleteBooking(bookingId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsForVenue'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};

// Exporting functions and hooks
export { fetchBookingsForVenue, fetchUserBookings, createBooking, updateBooking, deleteBooking};