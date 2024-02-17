import { Card, Input } from 'react-daisyui';
import { Link }from 'react-router-dom'
import styled from 'styled-components';


//list

export const VenueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const VenueWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

//item

export const StyledCard = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    min-height: 360px; // Changed to min-height to accommodate variable content size
    width: 280px;
    overflow: hidden;
  }
`;


export const StyledImage = styled.img`
  height: 210px; // Set the fixed height to match the previous container's height
  width: 100%; // Width is 100% to fill the width of the card
  object-fit: cover; // Adjust to cover to ensure the image fills the area without whitespace
  display: block;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;



export const StyledTitle = styled(Card.Title)`
  && {
    color: black;
    white-space: normal; // Ensures text wraps and doesn't overflow
  }
`;


export const CardFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem; // Adjust padding as needed
`;

export const StyledRating = styled.span`
  background-color: #ffc107; // Example: gold background for stars
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
`;

export const StyledDescription = styled.p`
  color: black;
  white-space: normal; // Ensures text wraps and doesn't overflow
  // Add any additional styling here
`;


export const StyledMaxGuests = styled(StyledDescription)`
  // Inherits from StyledDescription, add any specific styles here
`;

export const StyledPrice = styled(StyledDescription)`
  font-weight: bold; // Example: making the price bold
  color: #34d399; // Example: green color for price
`;

export const MetaData = styled(StyledDescription)`
  margin: 5px 0; // Adds a little margin for each meta data point for visual separation
`;

// Location Information
export const LocationInfo = styled(StyledDescription)`
  font-style: italic; // Just an example to differentiate location info
`;

// Owner Information
export const OwnerInfo = styled(StyledDescription)`
  font-weight: bold; // Highlights the owner's information
`;

// Booking Details
// Assuming bookings might need a list, you could style each booking detail similarly
export const BookingDetail = styled(StyledDescription)`
  background-color: #f0f0f0; // Light background for each booking detail for differentiation
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

// Adjustments for Existing Components
// You might want to adjust your existing components slightly for better presentation of additional data.




//filter

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 20rem; /* 320px */
  margin: 1rem auto;
  padding: 1rem;
`;

// Extending react-daisyui Input component
export const StyledInput = styled(Input)`
  width: 100%;
  max-width: 20rem; /* 320px */
`;

export const DropdownList = styled.ul`
  position: absolute;
  left: 1.25rem; /* 20px */
  right: 1.25rem; /* 20px */
  z-index: 30;
  background-color: #2d3748; /* Tailwind gray-700 */
`;

export const DropdownItem = styled.li`
  &:hover {
    background-color: #4a5568; /* Tailwind gray-600 */
  }
`;

export const StyledLink = styled(Link)`
  display: block;
  padding: 1rem;
`;