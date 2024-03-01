// project-exam-2-holidaze/src/stores/venuesStore.jsx

import { create } from 'zustand';

const useVenuesStore = create((set) => ({
  selectedVenueId: null,
  setSelectedVenueId: (id) => set({ selectedVenueId: id }),
  // Add more UI-related states as needed
}));

export default useVenuesStore;