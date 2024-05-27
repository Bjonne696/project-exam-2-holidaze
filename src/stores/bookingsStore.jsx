import { create } from 'zustand';

// Define a Zustand store for managing booking-related state
const useBookingsStore = create((set) => ({
  // Initialize state for the selected booking ID and setter function
  selectedBookingId: null,
  setSelectedBookingId: (id) => set({ selectedBookingId: id }),

  // Initialize state for the booking details modal visibility and setter function
  isBookingDetailsModalOpen: false,
  setBookingDetailsModalOpen: (isOpen) => set({ isBookingDetailsModalOpen: isOpen }),
}));

export default useBookingsStore;