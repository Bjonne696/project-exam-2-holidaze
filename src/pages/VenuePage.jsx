// project-exam-2-holidaze/src/pages/VenuePage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/authStore';
import 'react-datepicker/dist/react-datepicker.css';
import VenueItem from '../components/venues/VenueItem';
import { useFetchBookingsForVenue, useCreateBooking } from '../hooks/useBookingsApi';
import { useFetchVenueById } from '../hooks/useVenuesApi';

function VenuePage() {
  const { id: venueId } = useParams();
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token); // Safe access to token
  
  // Fetch venue details
  const { data: venue } = useFetchVenueById(venueId);

  // Fetch bookings for venue to determine unavailable dates
  const { data: bookings } = useFetchBookingsForVenue(venueId, token);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const { mutate: createBooking, isLoading: isBookingLoading, error: bookingError } = useCreateBooking();

  useEffect(() => {
    // Calculate unavailable dates based on bookings
    if (bookings) {
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
  }, [bookings]);

  const handleBookingSubmit = () => {
    if (!token) {
      alert("Please log in to make a booking");
      return;
    }
    const newBooking = {
      dateFrom: startDate,
      dateTo: endDate,
      guests,
      venueId,
    };
    createBooking(newBooking, {
      onSuccess: () => {
        alert('Booking successfully created');
        queryClient.invalidateQueries(['bookingsForVenue', venueId]); // Ensure the bookings list is refreshed
      },
      onError: (error) => {
        alert(`Booking creation failed: ${error.message}`);
      }
    });
  };

  if (isBookingLoading) return <div>Creating booking...</div>;
  if (bookingError) return <div>Error creating booking: {bookingError.message}</div>;

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
      <div>
        <h3>Unavailable for booking during:</h3>
        {unavailableDates.map((date, index) => (
          <p key={index}>{date.toLocaleDateString()}</p>
        ))}
      </div>
    </div>
  );
}

export default VenuePage;
