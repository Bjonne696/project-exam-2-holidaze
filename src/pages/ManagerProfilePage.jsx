// project-exam-2-holidaze/src/pages/ManagerProfilePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore, { isVenueManager } from '../stores/authStore';
import { useFetchManagedVenues } from '../hooks/useVenuesApi';
import VenueItem from '../components/venues/VenueItem';
import { Link } from 'react-router-dom';
import { useRevokeVenueManagerStatus } from '../hooks/useAuthHooks';

function ManagerProfilePage() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const isManager = isVenueManager();
  const revokeVenueManagerStatusMutation = useRevokeVenueManagerStatus();

  const { data: venues, refetch: refetchManagedVenues } = useFetchManagedVenues(user?.name, token);

  useEffect(() => {
    if (isManager && token) {
      refetchManagedVenues();
    }
  }, [isManager, token, refetchManagedVenues]);

  const handleRevokeManager = async () => {
    try {
      await revokeVenueManagerStatusMutation.mutateAsync();
      // If the mutation is successful, you can add any additional logic here
      console.log('Successfully revoked manager status');
    } catch (error) {
      // Handle error, you can log it or show a notification to the user
      console.error('Error revoking manager status', error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold">Manager Profile</h1>
      <button onClick={handleRevokeManager} className="btn btn-warning">
        Revoke Venue Manager Status
      </button>
      <Link to="/create-venue" className="btn btn-primary ml-4">
        Add New Venue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues?.map((venue) => (
          <VenueItem
            key={venue.id}
            data={venue}
            showActions={true}
            onDeleteClick={refetchManagedVenues} // Assuming deletion logic is handled elsewhere and here we just refetch
          />
        ))}
      </div>

      <Link to="/" className="text-blue-500">
        Return to Home
      </Link>
    </div>
  );
}

export default ManagerProfilePage;