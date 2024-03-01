import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore'; // If you need authentication

const fetchVenuesBatch = async (offset, limit = 100) => {
  try {
    const token = useAuthStore.getState().token; // Get token if needed
    const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the Authorization header if your API requires it
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch venues:", error);
    throw error; // Rethrow error to be handled by the caller
  }
};

export { fetchVenuesBatch };