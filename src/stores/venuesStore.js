// src/stores/venuesStore.js
import { create } from 'zustand';
import { BASE_URL } from '.././constants/api';

const useVenuesStore = create((set) => ({
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
