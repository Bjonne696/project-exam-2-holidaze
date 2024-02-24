//project-exam-2-hollidaze/src/components/venues/VenueFilter.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';

function VenueFilter({ venues = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md mx-auto my-4 p-4">
      <input
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" // Updated StyledInput with focus style
        placeholder="Search venues..." // Added placeholder for clarity
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value.trim())}
      />
      {filterVenues.length > 0 && searchTerm.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 bg-gray-700 mt-1 rounded-md shadow-lg"> {/* Updated DropdownList for full width and shadow */}
          {filterVenues.map((venue) => (
            <li key={venue.id} className="hover:bg-gray-600"> {/* Unchanged DropdownItem */}
              <Link to={`/venue/${venue.id}`} className="block p-4 text-white hover:text-gray-200"> {/* Updated StyledLink for text color */}
                {venue.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VenueFilter;
