import { useParams } from "react-router-dom";

function VenuePage() {
	const { id } = useParams();

	return <div>Venue page id: {id}</div>;
}

export default VenuePage;
