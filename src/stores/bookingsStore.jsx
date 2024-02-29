// src/stores/bookingsStore.js

import { create } from 'zustand';
import BASE_URL from '../constants/api';

const useBookingsStore = create((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,


  fetchBookingsForVenue: async (venueId) => {
    const { token } = get();
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/bookings?_venue=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch bookings for the venue');
      const bookings = await response.json();
      set({ bookings: bookings.filter(booking => booking.venue.id === venueId), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  fetchUserBookings: async (userName, authToken, data) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/profiles/${userName}/bookings`, {
        headers: {

          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg);
      }
      const bookings = await response.json();
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
},

  createBooking: async (bookingData) => {
    const { token } = get();
    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      // Optionally refresh bookings after creation
      get().fetchUserBookings();
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateBooking: async ({ bookingId, updateData }) => {
    const { token } = get();
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      // Optionally refresh bookings after update
      get().fetchUserBookings();
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteBooking: async (bookingId) => {
    const { token } = get();
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      // Optionally refresh bookings after deletion
      get().fetchUserBookings();
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useBookingsStore;