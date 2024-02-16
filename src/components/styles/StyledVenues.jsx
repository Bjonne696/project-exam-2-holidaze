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
    height: 360px;
    width: 280px;
    overflow: hidden; // Prevents any child from overflowing the card's dimensions
  }
`;

export const StyledImage = styled.img`
  height: 210px;
  width: 240px;
  object-fit: cover;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin: auto;
  display: block;
`;


export const StyledTitle = styled(Card.Title)`
  && {
    color: black;
    white-space: normal; // Ensures text wraps and doesn't overflow
  }
`;


export const StyledDescription = styled.p`
  color: black;
  white-space: normal; // Ensures text wraps and doesn't overflow
`;

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