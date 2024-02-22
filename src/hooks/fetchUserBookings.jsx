import BASE_URL from "../constants/api.js";

export const fetchUserBookings = async (userId, token) => {
    console.log(`Fetching bookings for user ID: ${userId} with token: ${token}`);
    const response = await fetch(`${BASE_URL}/profiles/${userId}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        console.error(message, response);
        throw new Error(message);
    }

    const data = await response.json();
    console.log('Fetched bookings data:', data);
    return data;
};

export default fetchUserBookings;