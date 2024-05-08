import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/authStore';
import 'react-datepicker/dist/react-datepicker.css';
import VenueItem from '../components/venues/VenueItem';
import { useCreateBooking } from '../hooks/useBookingsApi';
import { useFetchVenueById } from '../hooks/useVenuesApi';

function VenuePage() {
  const { id: venueId } = useParams();
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date().setDate(new Date().getDate() + 1)); 
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);
  const { data: venue, isLoading: venueLoading, error: venueError } = useFetchVenueById(venueId);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const createBookingMutation = useCreateBooking();

  useEffect(() => {
    const dates = venue?.bookings?.reduce((acc, booking) => {
      let currentDate = new Date(booking.dateFrom);
      const endDate = new Date(booking.dateTo);
      while (currentDate <= endDate) {
        acc.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return acc;
    }, []);
    setUnavailableDates(dates);
  }, [venue?.bookings]);

  const handleBookingSubmit = () => {
    if (!token) {
      alert("Please log in to make a booking");
      return;
    }
    if (!endDate) {
      alert("Please select an end date for your booking.");
      return;
    }
    const newBooking = {
      dateFrom: startDate,
      dateTo: endDate,
      guests,
      venueId,
    };
    createBookingMutation.mutate(newBooking, {
      onSuccess: () => {
        alert('Booking successfully created');
        queryClient.invalidateQueries(['venue', venueId]);
      },
      onError: (error) => {
        alert(`Booking creation failed: ${error.message}`);
      }
    });
  };

  // Limit the number of guests to the maximum allowed for the venue
  useEffect(() => {
    if (venue && guests > venue.maxGuests) {
      setGuests(venue.maxGuests);
    }
  }, [venue, guests]);

  if (venueLoading) return <div>Loading...</div>;
  if (venueError) return <div>Error loading venue details: {venueError.message}</div>;

  return (
    <div>
      {venue && <VenueItem data={venue} isDetailedView={true} />} {/* Removed hideDescription prop */}
      <h2 className="mr-4">Create a Booking</h2>
      <div className="flex flex-wrap items-center">
        
        <div className="mr-4">
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
        </div>
        <div className="mr-4">
          <label className="block mb-2">
            Number of Guests:
            <select className="mt-1 form-select" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[...Array(venue.maxGuests)].map((_, index) => (
                <option key={index + 1} value={index + 1}>{index + 1}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleBookingSubmit}>Create Booking</button>
      </div>
      <div className="my-8">
        <h2 className="text-xl font-bold">Unavailable for booking during these dates:</h2>
        {venue?.bookings && venue.bookings.length > 0 ? (
          <ul>
            {venue.bookings.map((booking) => (
              <li key={booking.id} className="my-2">
                {new Date(booking.dateFrom).toLocaleDateString()} to {new Date(booking.dateTo).toLocaleDateString()} - {booking.guests} guests
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found for this venue.</p>
        )}
      </div>
    </div>
  );
};

export default VenuePage;
