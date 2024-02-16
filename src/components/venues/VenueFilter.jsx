import { useState } from 'react';
import { Container, StyledInput, DropdownList, DropdownItem, StyledLink } from "../styles/StyledVenues";

function VenueFilter({ venues = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <StyledInput
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value.trim())}
      />
      {filterVenues.length > 0 && searchTerm.length > 0 && (
        <DropdownList>
          {filterVenues.map((venue) => (
            <DropdownItem key={venue.id}>
              <StyledLink to={`/venue/${venue.id}`}>
                {venue.name}
              </StyledLink>
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </Container>
  );
}

export default VenueFilter;
