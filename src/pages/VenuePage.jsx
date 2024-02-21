// src/pages/VenuePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import VenueItem from '../components/venues/VenueItem';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useVenueStore from '../stores/venuesStore';

const VenuePage = () => {
  const { id } = useParams();
  const { venue, isLoading, error, fetchVenueById } = useVenueStore();
  const [startDate, setStartDate] = React.useState(new Date());

  React.useEffect(() => {
    fetchVenueById(id);
  }, [id, fetchVenueById]);

  const handleDateChange = (date) => {
    setStartDate(date);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {venue ? <VenueItem data={venue} isDetailedView={true} /> : <p>Venue not found.</p>}
	  <ReactDatePicker
        selected={startDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default VenuePage;
