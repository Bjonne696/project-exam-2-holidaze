import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * VenueFilter component allows users to search and filter venues.
 * @param {Array} venues - List of venues to filter.
 */
function VenueFilter({ venues = [] }) {
  const [searchTerm, setSearchTerm] = useState(''); // State to manage the search term

  /**
   * Filters the venues based on the search term.
   * @returns {Array} Filtered list of venues.
   */
  const filterVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md mx-auto my-4 p-4">
      <input
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Search venues..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)} // Update the search term state on input change
      />
      {filterVenues.length > 0 && searchTerm.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 bg-gray-700 mt-1 rounded-md shadow-lg">
          {filterVenues.map((venue) => (
            <li key={venue.id} className="hover:bg-gray-600">
              <Link to={`/venue/${venue.id}`} className="block p-4 text-white hover:text-gray-200">
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