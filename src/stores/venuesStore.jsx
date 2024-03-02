// project-exam-2-holidaze/src/stores/venuesStore.jsx


import { create } from 'zustand';
import { fetchVenuesBatch } from '../hooks/useVenuesApi'; // Assume this utility function handles fetching

const useVenuesStore = create((set, get) => ({
  venues: [],
  isLoading: false,
  error: null,
  fetchAllVenues: async () => {
    set({ isLoading: true, error: null });
    let offset = 0;
    const allVenues = [];
    let hasMore = true;

    while (hasMore) {
      try {
        const batch = await fetchVenuesBatch(offset);
        if (batch.length === 0) {
          hasMore = false;
        } else {
          allVenues.push(...batch);
          offset += batch.length;
        }
      } catch (error) {
        set({ error });
        hasMore = false; // Stop the loop on error
      }
    }

    set({ venues: allVenues, isLoading: false });
  },
  selectedVenueId: null,
  setSelectedVenueId: (id) => set({ selectedVenueId: id }),
}));

export default useVenuesStore;