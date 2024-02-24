// project-exam-2-holidaze/src/hooks/bookings.jsx

const BASE_URL = "https://api.noroff.dev/api/v1/holidaze"; // Adjusted to match the provided API base URL

// Fetch all bookings, assuming that filtering by venue ID will be handled client-side or requires a different approach
export const fetchAllBookings = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // Authorization token required
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem fetching bookings:", error);
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