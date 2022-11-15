import express, {Express} from 'express';
import session, {CookieOptions, SessionOptions} from 'express-session';
import indexRouter from './routes/index.js';
import internalRouter from './routes/internal.js';
import morgan from 'morgan';
import cors from 'cors';
import fileStoreConstructor, {Options} from 'session-file-store';

/*import dotenv from 'dotenv';
dotenv.config();*/


class App {
	express: Express;
	private readonly frontendUrl: string;
	private readonly environment: string;
	private readonly sessionSecret: string;

	constructor() {
		this.express = express();
		this.frontendUrl = process.env.NODE_FRONTEND_URL ?? 'http://localhost:3000';
		this.environment = process.env.NODE_ENV ?? 'production';
		if (this.environment === 'development') {
			this.addDebugLog();
		}
		this.sessionSecret = process.env.NODE_SESSION_SECRET ?? 'not so secret';
		this.configure();
		this.addRoutes();
	}

	private addDebugLog() {
		this.express.use(morgan('dev'));
	}

	private configure() {
		this.express.use(express.json());
		this.express.use(express.urlencoded({extended: false}));

		const cookieOptions: CookieOptions = {
			secure: true,
			httpOnly: true
		};
		const sessionOptions: SessionOptions = {
			secret: this.sessionSecret,
			resave: false,
			saveUninitialized: true,
			cookie: cookieOptions
		};

		this.express.set('trust proxy', 1); // trust first proxy
		if (this.environment === 'production') {

		} else if (this.environment === 'development') {
			const corsOptions = {
				origin: this.frontendUrl,
				credentials: true
			};
			this.express.use(cors(corsOptions));

			cookieOptions.sameSite = 'none';
			cookieOptions.httpOnly = false;

			const filestoreOptions: Options = {
				path: './devsessions'
			};
			const fileStore = fileStoreConstructor(session);
			sessionOptions.store = new fileStore(filestoreOptions);
		}

		this.express.use(session(sessionOptions));
	}

	private addRoutes() {
		this.express.use('/', indexRouter);
		this.express.use('/api/internal', internalRouter);
	}
}

export default new App();
