import webpack from 'webpack';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

const plugin_name = 'convertWebpackFaviconsToMarkupPlugin';


export class convertWebpackFaviconsToMarkupPlugin {
    // Define `apply` as its prototype method which is supplied with compiler as its argument
    async apply(compiler: webpack.Compiler) {
        // Specify the event hook to attach to
        compiler.hooks.afterPlugins.tap(
            plugin_name,
            (compiler) => {

                const FaviconWebpackPlugin = new FaviconsWebpackPlugin({
                    logo: './src/app/images/favicon.png',
                    publicPath: '/blabla',
                    inject: true,
                    favicons: {
                        icons: {
                            android: true,
                            appleIcon: false,
                            appleStartup: false,
                            coast: false,
                            firefox: false,
                            windows: false,
                            yandex: false
                        }
                    }
                });

                var faviconCompilation = undefined;
                switch (FaviconWebpackPlugin.getCurrentCompilationMode(compiler)) {
                    case 'light':
                        faviconCompilation = FaviconWebpackPlugin.generateFaviconsLight(compiler, compiler);
                    case 'webapp':
                    default:
                        faviconCompilation = FaviconWebpackPlugin.generateFaviconsWebapp(compiler, compiler);
                }

                faviconCompilation.then(function (data) {
                    console.log('data', data);
                })

            }
        );
    }
}