// src/stores/bookingsStore.js

import { create } from 'zustand';

const useBookingsStore = create((set) => ({
  // Example state: ID of a booking selected in the UI
  selectedBookingId: null,

  // Actions
  setSelectedBookingId: (id) => set({ selectedBookingId: id }),
  
  // You can add more UI-related state and actions as needed.
  // For example, you might want to track whether a booking details modal is open:
  isBookingDetailsModalOpen: false,
  setBookingDetailsModalOpen: (isOpen) => set({ isBookingDetailsModalOpen: isOpen }),

  // Any other global states or actions that relate to the bookings in your application.
  // This could include filtering options, search terms, or anything else that
  // might need to be shared across components but doesn't directly involve fetching data.
}));

export default useBookingsStore;