

import { create } from 'zustand';

const useBookingsStore = create((set) => ({

  selectedBookingId: null,

  setSelectedBookingId: (id) => set({ selectedBookingId: id }),

  isBookingDetailsModalOpen: false,
  setBookingDetailsModalOpen: (isOpen) => set({ isBookingDetailsModalOpen: isOpen }),

}));

export default useBookingsStore;