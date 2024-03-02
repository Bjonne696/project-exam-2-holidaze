// project-exam-2-holidaze/src/stores/venuesStore.jsx
import{ create } from 'zustand';
import { fetchVenuesBatch } from '../hooks/useVenuesApi'; // Adjust the import path as needed

const useVenuesStore = create((set) => ({
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
        set({ error, isLoading: false });
        return;
      }
    }

    // Filter out duplicate venues based on their `id`
    const uniqueVenues = Array.from(new Map(allVenues.map(venue => [venue['id'], venue])).values());

    set({ venues: uniqueVenues, isLoading: false });
  },
}));

export default useVenuesStore;