
import {Session, SessionData} from "express-session";
import {DatabaseInterface} from "../../type/DatabaseInterface";
import type {DatumEvent} from "../../../../shared/type/Event";
import type {StoredDatumEvent} from "../../../../shared/type/StoredEvent";

type SessionEventStore = {
	[index: number]: StoredDatumEvent;
}
declare module 'express-session' {
	interface SessionData {
		events?: SessionEventStore
	}
}

export default class SessionStorage implements DatabaseInterface {
	private session: Session & Partial<SessionData>;

	constructor(session: Session & Partial<SessionData>) {
		this.session = session;
		if (!this.session.events) {
			this.session.events = {};
		}
	}

	connect(): boolean {
		return true;
	}

	createEvent(event: DatumEvent): StoredDatumEvent {
		const nextId = Math.max(...this.getStoredIds(), 0) + 1,
			newEvent = {...event, ...{id: nextId}};

		this.session.events![nextId] = newEvent;

		return newEvent;
	}

	deleteEvent(event: StoredDatumEvent): StoredDatumEvent {
		const storedEvent = this.getEvent(event.id);

		delete this.session.events![storedEvent.id];

		return storedEvent;
	}

	getEvent(id: number): StoredDatumEvent {
		if (!this.session.events || !this.session.events[id]) {
			throw new Error(`DatumEvent ID #${id} does not exist`);
		}
		return this.session.events[id];
	}

	listEvents(page = 0, limit = 10): StoredDatumEvent[] {
		if (!this.session.events) {
			return [];
		}

		const sliceOfIds = this.getStoredIds().slice(page * limit, limit),
			response = [];

		for (let i = 0, l = sliceOfIds.length; i < l; i++) {
			response.push(this.session.events[sliceOfIds[i]]);
		}
		return response;
	}

	updateEvent(event: StoredDatumEvent): StoredDatumEvent {
		const storedEvent = this.getEvent(event.id),
			updatedEvent = {...storedEvent, ...event, ...{id: storedEvent.id}};

		this.session.events![event.id] = updatedEvent;

		return updatedEvent;
	}

	private getStoredIds(): number[] {
		return Object.keys(this.session.events ?? {}).map((idString) => parseInt(idString));
	}
}