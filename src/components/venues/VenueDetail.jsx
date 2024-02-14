import { Card } from "react-daisyui";
import PropTypes from "prop-types";

function VenueDetail({ title, image, description, price, maxGuests, rating, location, }) {
	return (
		<Card imageFull className="flex-auto">
			<Card.Image src={image} alt={title} />
			<Card.Body>
				<Card.Title tag="h2" className="text-white">
					{title}
				</Card.Title>
				<p className="text-white">{description}</p>
                <p className="text-white">Price: {price}</p>
                <p className="text-white">Max Guests: {maxGuests}</p>
                <p className="text-white">Rating: {rating}</p>
                <p className="text-white">Address: {location.address}, {location.city}</p>
			</Card.Body>
		</Card>
	);
}

export default VenueDetail;

VenueDetail.propTypes = {
	title: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired, // Assuming price is a number
	maxGuests: PropTypes.number.isRequired, // Assuming maxGuests is a number
	rating: PropTypes.number.isRequired, // Assuming rating is a number
	location: PropTypes.shape({ // Assuming location is an object with address and city
		address: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
	}).isRequired,
};