// project-exam-2-holidaze/src/hooks/venuesService.js

import BASE_URL from '../constants/api';

export const createVenue = async (venueData, token) => {
  const response = await fetch(`${BASE_URL}/venues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(venueData),
  });
  if (!response.ok) {
    throw new Error(`Failed to create venue, status: ${response.status}`);
  }
  return response.json();
};