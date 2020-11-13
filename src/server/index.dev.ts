import { initExpressServer, startListening } from './express';

import { initDevMiddleware } from './webpack';

export async function applicationServer() {
	return initExpressServer()
		.then(initDevMiddleware)
		.then(startListening);
}