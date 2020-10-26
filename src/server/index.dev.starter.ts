import webpack from 'webpack';
import { fs } from 'memfs';

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

function runApplicationServerFromMemory(compiler: webpack.Compiler) {
	// Compile to in-memory file system.
	// tslint:disable-next-line: no-any
	compiler.outputFileSystem = fs as any; // sigh, writeFile types do _somehow_ not match!

	compiler.run((err, stats) => {
		if (err) {
			throw err;
		}
		if (stats && stats.hasErrors()) {
			const errors = stats.compilation ? stats.compilation.errors : null;
			if (errors) {
				errors.forEach((error) => console.error(error.message));
			}
			throw errors;
		}

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
