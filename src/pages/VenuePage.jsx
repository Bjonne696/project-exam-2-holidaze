// project-exam-2-holidaze/src/pages/VenuePage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/authStore';
import 'react-datepicker/dist/react-datepicker.css';
import useBookingsStore from '../stores/bookingsStore'; // Adjusted import
import VenueItem from '../components/venues/VenueItem';
import useVenueStore from '../stores/venuesStore';
import { fetchBookingsForVenue } from '../hooks/bookings'; // Corrected import for fetchBookingsForVenue

function VenuePage() {
  const { id: venueId } = useParams(); // Use useParams to get the venueId from the URL
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [guests, setGuests] = useState(1); // Default to 1 guest
  const queryClient = useQueryClient();
  const { token } = useAuthStore((state) => ({ token: state.token }));
  const { createBooking } = useBookingsStore();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const { venue, fetchVenueById } = useVenueStore(); // Destructure fetchVenueById from useVenueStore

  useEffect(() => {
    fetchVenueById(venueId);
  }, [venueId, fetchVenueById]);

  // Adjusted to fetchAllBookings and filtered by venueId client-side if needed
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings', venueId],
    queryFn: () => fetchVenueBookings(venueId),
    enabled: !!venueId,
  });

  const bookingMutation = useMutation({
    mutationFn: (newBooking) => createBooking(newBooking, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings', venueId]);
    },
    onError: (error) => {
      alert(`Booking creation failed: ${error.message}`);
    }
  });

  useEffect(() => {
    const loadBookings = async () => {
      if (token && venueId) {
        const bookings = await fetchBookingsForVenue(venueId, token);
        const dates = bookings.reduce((acc, booking) => {
          let currentDate = new Date(booking.dateFrom);
          const endDate = new Date(booking.dateTo);

          while (currentDate <= endDate) {
            acc.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return acc;
        }, []);

        setUnavailableDates(dates);
      }
    };

    loadBookings();
  }, [token, venueId]);

  const handleBookingSubmit = () => {
    if (!token) {
      alert("Please log in to make a booking");
      return;
    }
    bookingMutation.mutate({ dateFrom, dateTo, guests, venueId });
  };

  if (isLoadingBookings) return <div>Loading bookings...</div>;

  return (
    <div>
      {venue && <VenueItem data={venue} isDetailedView={true} />}
      <h2>Create a Booking</h2>
      <DatePicker
      selected={startDate}
      onChange={([start, end]) => {
        setStartDate(start);
        setEndDate(end);
      }}
      startDate={startDate}
      endDate={endDate}
      excludeDates={unavailableDates}
      selectsRange
      inline
    />
      <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} placeholder="Number of Guests" />
      <button onClick={handleBookingSubmit}>Create Booking</button>
    </div>
  );
}

export default VenuePage;