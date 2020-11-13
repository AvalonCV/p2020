import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

import getWebpackConfiguration from './../../webpack.config';

import requireFromString from 'require-from-string';

const server_configuration = getWebpackConfiguration(process.env).filter((element) => {
	if (element.name === 'server') {
		element.entry = ['./src/server/index.dev.ts'];
		return true;
	} else {
		return false;
	}
})[0];

interface ErrorWithDetails extends Error {
	details?: string
}

function runApplicationServerFromMemory(compiler: webpack.Compiler) {
	// Compile to in-memory file system.
	const fs = createFsFromVolume(new Volume());
	// tslint:disable-next-line: no-any
	compiler.outputFileSystem = fs as any; // sigh, writeFile types do _somehow_ not match!

	compiler.run((err: ErrorWithDetails | undefined, stats) => {

		if (err) {
			console.error(err.stack || err);
			if (err.details) {
				console.error(err.details);
			}
			return;
		}

		if (stats) {
			const info = stats.toJson();

			if (stats.hasErrors()) {
				console.error('Errors', info.errors);
			}

			// if (stats.hasWarnings()) {
			// 	console.warn('Warnings', info.warnings);
			// }
		}

		// Log result...

		if (server_configuration.output) {
			const { path, filename } = server_configuration.output;
			const buffer = fs.readFileSync(path + '/' + filename);

			const dev = requireFromString(buffer.toString(), 'applicationServer');
			dev.applicationServer();
		} else {
			throw new Error('No output for webpack compilation found');
		}
	});
}

runApplicationServerFromMemory(webpack(server_configuration));
