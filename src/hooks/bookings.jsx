// project-exam-2-holidaze/src/hooks/bookings.jsx

import BASE_URL from '../constants/api';

// Fetch all bookings, assuming that filtering by venue ID will be handled client-side or requires a different approach
export const fetchBookingsForVenue = async (venueId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const allBookings = await response.json();
    // Filter bookings by venueId
    return allBookings.filter(booking => booking.venueId === venueId);
  } catch (error) {
    console.error("There was a problem fetching bookings for the venue:", error);
    throw error;
  }
};


// Fetch all bookings for the currently authenticated user
export const fetchUserBookings = async (token, name) => {
  try {
    const response = await fetch(`${BASE_URL}/holidaze/profiles/${name}/bookings`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem fetching the user's bookings linked to the profile:", error);
    throw error;
  }
};

// Function to create a new booking with the necessary details including the _customer and _venue query parameters
export const createBooking = async (bookingData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings?_customer=true&_venue=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Including the Authorization header
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem creating the booking:", error);
    throw error;
  }
};


// Function to update an existing booking
export const updateBooking = async ({ id, updateData, token }) => {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
  });

  if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
  }

  return response.json();
};


// Function to delete a booking
export const deleteBooking = async ({ id, token }) => {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
  });

  if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
  }

  // Response might be empty for a DELETE operation, adjust as needed
  return true;
};

// Function to enable a user to become a venue manager
export const becomeVenueManager = async ({ token, name }) => {
  // Assuming an endpoint or mechanism exists to update user profile
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: true }),
  });

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return response.json();
};

// Function to revoke venue manager status from a user
export const revokeVenueManagerStatus = async ({ token, name }) => {
  // Assuming an endpoint or mechanism exists to update user profile
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: false }),
  });

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return response.json();
};
