import { Loading, Input } from "react-daisyui";
import VenueList from "../components/venues/VenueList"
import { useFetch } from "../hooks/useFetch";
import VenueFilter from "../components/venues/VenueFilter";
import { BASE_URL } from "../constants/apiService";

export default function HomePage() {
	const { data: venues, isLoading, error } = useFetch(BASE_URL);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return (
			<Alert>
				<span>{error}</span>
			</Alert>
		);
	}

	return (
		<div className="container mx-auto">
			<VenueFilter venues={venues} />
			<VenueList venues={venues} />
		</div>
	);
}
