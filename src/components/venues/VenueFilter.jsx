import { useState } from 'react';
import { Input } from 'react-daisyui';
import { Link } from 'react-router-dom';

function VenueFilter({ venues = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Use the 'name' property for filtering instead of 'title'
  const filterVenues = venues.filter((venue) =>
  venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full mx-auto p-4 max-w-xs">
      <Input
        className="w-full max-w-xs"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value.trim())}
      />
      {filterVenues.length > 0 && searchTerm.length > 0 && (
        <ul className="absolute left-5 right-5 z-30 bg-gray-700">
          {filterVenues.map((venue) => (
            <li key={venue.id}>
              <Link
                to={`/venue/${venue.id}`}
                className="block p-4 hover:bg-gray-600"
              >
                {venue.name} {/* Display the venue's name */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VenueFilter;
