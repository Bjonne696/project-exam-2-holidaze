// project-exam-2-holidaze/src/pages/VenuePage.jsx

// VenuePage.jsx

import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import authStore from '../stores/authStore';
import 'react-datepicker/dist/react-datepicker.css';
import { createBooking } from '../hooks/bookings';
import VenueItem from '../components/venues/VenueItem';
import { useFetchVenueById } from '../hooks/useVenues';

function VenuePage() {
  const { id: venueId } = useParams(); // Use useParams to get the venueId from the URL
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [guests, setGuests] = useState(1); // Default to 1 guest
  const queryClient = useQueryClient();
  const { token } = authStore((state) => state);

  // Correctly destructure the data, isLoading, and error from useFetchVenueById
  const { data: venue, isLoading: isLoadingVenue, error: venueError } = useFetchVenueById(venueId);

  const bookingMutation = useMutation({
    mutationFn: (newBooking) => createBooking(newBooking, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings', venueId]);
    },
    onError: (error) => {
      alert(`Booking creation failed: ${error.message}`);
    }
  });

  const handleBookingSubmit = () => {
    if (!token) {
      alert("Please log in to make a booking");
      return;
    }
    bookingMutation.mutate({ dateFrom, dateTo, guests, venueId });
  };

  if (isLoadingVenue) return <div>Loading venue...</div>;
  if (venueError) return <div>Error loading venue: {venueError.message}</div>;

  return (
    <div>
      <VenueItem data={venue} isDetailedView={true} />
      <h2>Create a Booking</h2>
      <DatePicker selected={dateFrom} onChange={(date) => setDateFrom(date)} />
      <DatePicker selected={dateTo} onChange={(date) => setDateTo(date)} />
      <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} placeholder="Number of Guests" />
      <button onClick={handleBookingSubmit}>Create Booking</button>
    </div>
  );
}

export default VenuePage;