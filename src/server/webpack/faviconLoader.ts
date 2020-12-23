import webpack from 'webpack';
import { getOptions, interpolateName } from 'loader-utils';

import favicons from 'favicons';

export interface FaviconLoaderOptions {
    context?: object;
    emitFile?: true;
    namePrefix?: string;
    outputPath?: string;
    faviconConfiguration?: Partial<favicons.Configuration>;
}

const loader = function (content): void {
    if (typeof content === 'string') {
        throw new Error('This is a raw loader - content should not be a string');
    } else {
        this.cacheable && this.cacheable(true);
        this.addDependency(this.resourcePath);

        const options: FaviconLoaderOptions = getOptions(this) || {};
        const { emitFile = true, context, faviconConfiguration } = options;
        const callback = this.async();

        const favicon_configuration: Partial<favicons.Configuration> = {
            path: options.outputPath,
            ...(faviconConfiguration || {}),
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                firefox: false,
                yandex: false,
                windows: false,
                ...((faviconConfiguration && faviconConfiguration.icons) || {})
            }
        };

        favicons(content, favicon_configuration)
            .then(response => {
                const complete_html = response.html.reduce((result, current_html) => {
                    return result + '' + current_html.replace(/(.*?href=)(.*)/, `$1' + __webpack_public_path__ + '$2 `);
                }, '');
                let result = `module.exports = '${complete_html}';`;

                response.images.forEach(image => {
                    const file_hash = interpolateName(this, '[hash:5]', {
                        context: context || this.rootContext || this.context,
                        content: image.contents
                    });

                    const tmp_filename = image.name.split('.');
                    tmp_filename.splice(-1, 0, file_hash);
                    const hashed_filename = tmp_filename.join('.');

                    result = result.replace(image.name, hashed_filename);
                    emitFile && this.emitFile((options.outputPath || '') + hashed_filename, image.contents, null);
                });

                callback && callback(null, result);
            })
            .catch(error => {
                console.error('error', error);
                callback && callback(error);
            });
    }
};

export default loader;
export const raw = true;