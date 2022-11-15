import BaseController from "./BaseController.js";
import {DatumEvent} from "../../../shared/type/Event";
import {StoredDatumEvent} from "../../../shared/type/StoredEvent";

export default class EventController extends BaseController {

	createEvent(event: DatumEvent): StoredDatumEvent {
		this.db.connect();
		return this.db.createEvent(event);
	}
}