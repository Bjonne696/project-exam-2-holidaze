import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importing components from React Router
import useAuthStore, { isVenueManager } from '../stores/authStore'; // Importing authentication store and helper function
import { useFetchManagedVenues } from '../hooks/useVenuesApi'; // Importing custom hook for fetching managed venues
import VenueItem from '../components/venues/VenueItem'; // Importing VenueItem component
import { useRevokeVenueManagerStatus } from '../hooks/useAuthHooks'; // Importing custom hook for revoking venue manager status

function ManagerProfilePage() {
  const navigate = useNavigate(); // React Router's hook for navigation
  const { token, user } = useAuthStore(); // Accessing authentication state from store
  const isManager = isVenueManager(); // Checking if user is a venue manager
  const revokeVenueManagerStatusMutation = useRevokeVenueManagerStatus(); // Mutation function to revoke venue manager status

  // Fetching managed venues when user is a manager and has a token
  const { data: venues, refetch: refetchManagedVenues } = useFetchManagedVenues(user?.name, token);

  useEffect(() => {
    // Refetching managed venues when user is a manager and has a token
    if (isManager && token) {
      refetchManagedVenues();
    }
  }, [isManager, token, refetchManagedVenues]);

  // Function to handle revoking venue manager status
  const handleRevokeManager = async () => {
    try {
      // Calling the mutation function to revoke manager status
      await revokeVenueManagerStatusMutation.mutateAsync();
      console.log('Successfully revoked manager status');
    } catch (error) {
      console.error('Error revoking manager status', error);
    }
  };

  // CSS class for button styling
  const buttonStyle = "btn border border-#810f0f rounded-full text-center mx-auto bg-card-background";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Manager Profile</h1>
      {/* Buttons for revoking manager status and adding new venue */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button onClick={handleRevokeManager} className={`${buttonStyle} btn-warning`}>
          Revoke Venue Manager Status
        </button>

        <Link to="/create-venue" className={`${buttonStyle} btn-warning`}>
          Add New Venue
        </Link>
      </div>

      {/* Displaying managed venues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues?.map((venue) => (
          <VenueItem
            key={venue.id}
            data={venue}
            showActions={true}
            onDeleteClick={refetchManagedVenues}
            hideDescription={true}
          />
        ))}
      </div>
    </div>
  );
}

export default ManagerProfilePage;
