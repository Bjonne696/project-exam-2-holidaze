import { create } from 'zustand';
import { fetchVenuesBatch } from '../hooks/useVenuesApi'; 

// Define a Zustand store for managing venues-related state
const useVenuesStore = create((set) => ({
  // Initialize state for venues data, loading status, and error
  venues: [],
  isLoading: false,
  error: null,
  
  // Define an async function to fetch all venues
  fetchAllVenues: async () => {
    // Set loading state to true and clear any previous errors
    set({ isLoading: true, error: null });
    
    let offset = 0;
    const allVenues = [];
    let hasMore = true;

    // Fetch venues in batches until there are no more venues to fetch
    while (hasMore) {
      try {
        // Fetch a batch of venues
        const batch = await fetchVenuesBatch(offset);
        
        // Check if the batch is empty, indicating no more venues
        if (batch.length === 0) {
          hasMore = false;
        } else {
          // Append the batch to the list of all venues
          allVenues.push(...batch);
          offset += batch.length;
        }
      } catch (error) {
        // If an error occurs during fetching, set error state and stop fetching
        set({ error, isLoading: false });
        return;
      }
    }

    // Deduplicate venues based on ID
    const uniqueVenues = Array.from(new Map(allVenues.map(venue => [venue['id'], venue])).values());

    // Set venues state with deduplicated list and loading state to false
    set({ venues: uniqueVenues, isLoading: false });
  },
}));

export default useVenuesStore;