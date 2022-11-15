import {DatumEvent} from "../../../shared/type/Event";
import {StoredDatumEvent} from "../../../shared/type/StoredEvent";

export interface DatabaseInterface {
	connect: () => boolean;
	getEvent: (id: number) => StoredDatumEvent;
	listEvents: (page?: number, limit?: number) => StoredDatumEvent[];
	createEvent: (event: DatumEvent) => StoredDatumEvent;
	deleteEvent: (event: StoredDatumEvent) => StoredDatumEvent;
	updateEvent: (event: StoredDatumEvent) => StoredDatumEvent;
}