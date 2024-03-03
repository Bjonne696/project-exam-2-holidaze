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
      console.log('Successfully revoked manager status');
    } catch (error) {
      console.error('Error revoking manager status', error);
    }
  };

  const buttonStyle = "btn border border-#810f0f rounded-full text-center mx-auto bg-card-background";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Manager Profile</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button onClick={handleRevokeManager} className={`${buttonStyle} btn-warning`}>
          Revoke Venue Manager Status
        </button>
        {/* Changed the button color to match the "Revoke Venue Manager Status" button */}
        <Link to="/create-venue" className={`${buttonStyle} btn-warning`}>
          Add New Venue
        </Link>
      </div>

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