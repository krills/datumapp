import {Request} from "express";
import SessionStorage from "./db/SessionStorage.js";
import {DatabaseInterface} from "../type/DatabaseInterface.js";

export default class BaseController {
	db: DatabaseInterface;
	request: Request;

	constructor(request: Request) {
		this.request = request;
		this.db = new SessionStorage(request.session);
	}
}