import {Container} from "../../Container";
import TreatOfTheMonthFullSize from "./TreatOfTheMonthFullSize";
import TreatOfTheMonthThumbnail from "./TreatOfTheMonthThumbnail";
export default function TreatOfTheMonthCard({images}) {
	return (
		<Container className="grid grid-cols-2 gap-4">
			<Container>
				<TreatOfTheMonthFullSize image={images && images[0]} />
			</Container>
			<Container>
				<TreatOfTheMonthThumbnail images={images} />
			</Container>
		</Container>
	);
}
