import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore';


const fetchBookingsForVenue = async (venueId, token) => {
  const response = await fetch(`${BASE_URL}/venues/${venueId}?_bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch bookings for the venue');
  return response.json();
};


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


export const useFetchBookingsForVenue = ({ venueId, token }) => {
  return useQuery({
    queryKey: ['bookingsForVenue', venueId],
    queryFn: () => fetchBookingsForVenue(venueId, token),
    enabled: !!venueId && !!token,
  });
};

export const useFetchUserBookings = ({ userName, token }) => {
  return useQuery({
    queryKey: ['userBookings', userName],
    queryFn: () => fetchUserBookings(userName, token),
    enabled: !!userName && !!token,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token); 
 
  return useMutation({
    mutationFn: (newBooking) => {
      
      return fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(newBooking),
      })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
      });
    },
    onSuccess: () => {

      queryClient.invalidateQueries(['bookingsForVenue']);
      queryClient.invalidateQueries(['userBookings']);
    },
  });
};


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

export { fetchBookingsForVenue, fetchUserBookings, createBooking, updateBooking, deleteBooking}


