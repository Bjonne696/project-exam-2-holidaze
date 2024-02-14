// app/src/styles/VenueCardStyles.js

import styled from 'styled-components';

export const Card = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

export const CardMedia = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const CardTitle = styled.h2`
  margin-top: 0;
`;

export const CardText = styled.p`
  color: #666;
`;

