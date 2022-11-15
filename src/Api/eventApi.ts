import Api from "./api";
import {DatumEvent} from "../../shared/type/Event";
import EventError from "../Model/EventError";

export default class EventApi {
	base: typeof Api;

	constructor(api: typeof Api) {
		this.base = api;
	}

	createEvent(event: DatumEvent): Promise<DatumEvent> {
		/*if (this.#cachedMedia[mediaId]) {
			return new Promise(resolve => {
				resolve(this.#cachedMedia[mediaId]);
			});
		}*/

		return this.base.post('events', event)
			.then(response => {
				if (response.status !== 200) {
					throw new EventError('Could not create event; ' + response.statusText);
				}
				return response;
			})
			.then(response => response.json())
			.then((storedEvent: DatumEvent) => {
				//this.#cachedMedia[mediaId] = media;
				return storedEvent;
			});
	}
}