import { initExpressServer, startListening } from './express';

export function applicationServerDoesNotExist() {
	return startListening(initExpressServer());
}
