#!/usr/bin/env node

import app from './App.js';
import https, {ServerOptions} from 'https';
import fs from "fs";

const express = app.express;
const port = process.env.BACKEND_PORT || 9000;

express.set('port', port);

const sslOptions: ServerOptions = {
	key: fs.readFileSync(new URL('./../../certs/localhost.key', import.meta.url)),
	cert: fs.readFileSync(new URL('./../../certs/localhost.crt', import.meta.url))
};
const server = https.createServer(sslOptions, express);

server.listen(
	port,
	() => console.log(`server started on "${port}" in "${process.env.NODE_ENV}"`)
);