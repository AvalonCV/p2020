import express from 'express';

import compression from 'compression';

export const initExpressServer = () => {
	const app = express();
	app.disable('x-powered-by');
	app.use(compression());

	return Promise.resolve(app);
};

export const startListening = (app: express.Express) => {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`App is listening on port ${port}.`);
	});
	return Promise.resolve(app);
};
