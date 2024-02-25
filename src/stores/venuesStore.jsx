// project-exam-2-holidaze/src/stores/venuesStore.jsx

import { create } from 'zustand';
import BASE_URL from '.././constants/api';


const useVenuesStore = create((set, get) => ({
  venues: [],
  venue: null,
  isLoading: false,
  error: null,
  limit: 100, // Assuming 100 venues per fetch is reasonable
  offset: 0, // Start from the beginning

  fetchVenues: async (increment = true) => {
    set({ isLoading: true });
    const { offset, limit } = get(); // Destructure for current state
    try {
      const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch venues');
      let newData = await response.json();
      // Deduplicate newData based on venue ID
      const seenIds = new Set(get().venues.map(venue => venue.id));
      newData = newData.filter(venue => {
        return seenIds.has(venue.id) ? false : seenIds.add(venue.id);
      });
      
      console.log("Venues fetched successfully:", newData); // Log the fetched data
      set((state) => ({
        venues: increment ? [...state.venues, ...newData] : newData,
        offset: state.offset + newData.length, // Update offset based on fetched data length
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({ error: error.message, isLoading: false }));
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
      console.log("Re-fetching venues after successful creation.");
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateVenue: async (venueId, venueData, token) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(venueData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update venue: ${errorData.message}`);
      }
      // After successful update, re-fetch venue to update the UI
      const updatedVenue = await response.json();
      set((state) => ({
        venues: state.venues.map(venue => venue.id === venueId ? updatedVenue : venue),
        isLoading: false,
      }));
      console.log("Venue updated successfully.");
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVenue: async (venueId, token) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }
      set((state) => ({
        venues: state.venues.filter((venue) => venue.id !== venueId),
        isLoading: false,
      }));
      console.log("Venue deleted successfully.");
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchManagedVenues: async (profileName, token) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/profiles/${profileName}/venues`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch managed venues');
      const managedVenues = await response.json();
      set({ venues: managedVenues, isLoading: false });
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
