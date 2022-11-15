import EventApi from "./eventApi";

export type AccessToken = {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string[];
	token_type?: string;
}

export type CancelablePromise = {
	promise: Promise<any>;
	cancel: () => void;
}

export type ErrorHandler = (httpResponse: Response) => void;

export class Api {
	host: string;
	clientId?: string;
	accessToken?: AccessToken;
	events: EventApi;

	constructor(host?: string, clientId?: string, accessToken?: AccessToken)
	{
		this.host = host || process.env.REACT_APP_API_URL || 'missingReactAppApiUrl';
		this.clientId = clientId;
		this.accessToken = accessToken;
		this.events = new EventApi(this);
	}

	static fromJSON(data: { host: string, clientId: string, accessToken: AccessToken }): Api
	{
		return new Api(data.host, data.clientId, data.accessToken)
	}

	makeCancelable(promise: Promise<any>): CancelablePromise
	{
		let hasCanceled_ = false;

		const wrappedPromise = new Promise((resolve, reject) => {
			promise.then(
				val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
				error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
			);
		});

		return {
			promise: wrappedPromise,
			cancel: () => {
				hasCanceled_ = true;
			}
		};
	};

	get(endpoint: string, params: {[key: string]: string|number} = {}): Promise<Response>
	{
		const query = [];
		for (const [key, value] of Object.entries(params)) {
			query.push(key + '=' + value)
		}
		return this.__call(
			'GET',
			endpoint + (query.length ? '?' + query.join('&') : ''),
			{}
		);
	}

	post(endpoint: string, data: {}, dataType: string = 'application/json'): Promise<Response>
	{
		return this.__call('POST', endpoint, { 'Content-Type': dataType }, data);
	}

	async __call(
		type: string,
		endpoint: string,
		headers: {[key: string]: string} = {},
		data?: {},
		retry?: boolean
	): Promise<Response>
	{
		console.log('__call',type,this.host + endpoint,data,retry,headers)
		return new Promise(async (resolve, reject) => {
			const options: RequestInit = {
				credentials: 'include',
				method: type,
				headers: Object.assign({
					//'Authorization': 'Bearer ' + this.accessToken?.access_token
				}, headers)
				//cache: 'no-cache'
			};

			if (data) {
				options.body = JSON.stringify(data);
			}

			try {
				const request = new Request(this.host + '/api/internal/' + endpoint, options);
				//console.log(request.credentials)
				const response = await fetch(request);

				if (response.status === 401) {
					if (!retry
						&& this.clientId
						&& this.accessToken?.refresh_token
						//&& await this.reAuthenticate(this.clientId, this.accessToken?.refresh_token)
						) {

						const retriedResponse = await this.__call(type, endpoint, headers, data, true);
						if (retriedResponse.status === 200) {
							resolve(retriedResponse);
						} else {
							reject(retriedResponse)
						}
					} else {
						reject(response);
					}
				} else {
					resolve(response);
				}
			} catch (e: any) {
				reject(e.message);
			}
		});
	}

/*
	async reAuthenticate(clientId: string, refreshToken: string): Promise<AccessToken|false> {
		const response = await fetch('https://' + this.host + '/api/v1/oauth2/token.json', {
			method: 'POST',
			cache: 'no-cache',
			headers: { 'Content-shared': 'application/x-www.ts-form-urlencoded' },
			body: [
				'grant_type=refresh_token',
				'client_id=' + clientId,
				'refresh_token=' + refreshToken
			].join('&')
		});

		if (response.status !== 200) {
			this.stateChange(false);

			return false;
		}

		const accessToken: AccessToken = await response.json();

		this.clientId = clientId;
		this.accessToken = accessToken;
		this.stateChange(accessToken);

		return accessToken;
	}*/

	async authenticate(clientId: string, username: string, password: string): Promise<AccessToken|false> {
		const response = await fetch('https://' + this.host + '/api/v1/oauth2/token', {
			method: 'POST',
			cache: 'no-cache',
			headers: { 'Content-Type': 'application/x-www.ts-form-urlencoded' },
			body: [
				'grant_type=password',
				'client_id=' + clientId,
				'username=' + username,
				'password=' + password
			].join('&')
		});

		if (response.status !== 200) {
			return false;
		}

		const accessToken: AccessToken = await response.json();

		this.clientId = clientId;
		this.accessToken = accessToken;

		return accessToken;
	}
}

export default new Api();