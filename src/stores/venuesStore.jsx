// project-exam-2-holidaze/src/stores/venuesStore.jsx

import { create } from 'zustand';
import BASE_URL from '.././constants/api';

const useVenuesStore = create((set, get) => ({
  venues: [],
  venue: null,
  isLoading: false,
  error: null,
  fetchVenues: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/venues`);
      if (!response.ok) throw new Error('Failed to fetch venues');
      const data = await response.json();
      set({ venues: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  createVenue: async (venueData, token) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/venues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(venueData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create venue: ${errorData.message}`);
      }
      // After successful creation, re-fetch venues to update the list
      await get().fetchVenues(); // Use get() to access other actions within the store
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchVenueById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/venues/${id}`);
      if (!response.ok) throw new Error('Failed to fetch venue');
      const data = await response.json();
      set({ venue: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  // Add other state and actions as needed
}));


export default useVenuesStore;
