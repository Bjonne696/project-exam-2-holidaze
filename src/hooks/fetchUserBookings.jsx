// project-exam-2-holidaze/src/hooks/fetchUserBookings.jsx

import BASE_URL from "../constants/api.js";

// Fetches user bookings
export const fetchUserBookings = async (token) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    return response.json();
};

// Attempts to set the user's venueManager status to true
export const becomeVenueManager = async ({ token, name }) => {
    const response = await fetch(`${BASE_URL}/profiles/${name}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueManager: true }),
    });

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    return response.json();
};

// Corrected function to revoke venue manager status, including missing parameter and fixing fetch call structure
export const revokeVenueManagerStatus = async ({ token, name }) => {
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

export default fetchUserBookings;