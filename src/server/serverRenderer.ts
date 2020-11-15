import webpack from 'webpack';

import { Request, Response, NextFunction } from 'express';
import { minify } from 'html-minifier';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './../app/App';

import { createRenderer, } from 'fela';
import { renderToMarkup } from 'fela-dom';
import normalize_css from './../app/css/normalize.8.0.1.css';
import core_css from './../app/css/core.css';

const is_production = process.env.NODE_ENV === 'production';

const getWebpackScriptAssets = (res: Response) => {
    const assets: string[] = [];

    if (is_production) {
        assets.push('public/js/client.js');
    } else {

        // better do it like 'https://github.com/webpack/webpack/issues/10790#issuecomment-620647237'
        const webpackStats: webpack.Stats[] = res.locals.webpack.devMiddleware.stats.stats;

        webpackStats
            .filter(element => {
                const { compilation }: { compilation: webpack.Compilation } = element;
                return compilation.name === 'client';
            })
            .forEach(element => {
                for (let asset in element.compilation.assets) {
                    if (element.compilation.assets.hasOwnProperty(asset)) {
                        asset.endsWith('.js') && !asset.endsWith('.hot-update.js') && assets.push(asset);
                    }
                }
            });
    }

    return assets;
};


const printWebpackScriptAssets = (response: Response) => {
    return (
        getWebpackScriptAssets(response)
            .map(
                (path, _index, array) =>
                    `<script type="text/javascript" src="/${path}" ${array.length === 1 ? 'async' : 'defer'}></script>`
            )
            .join('\n')
    );
};



export default function serverRenderer() {
    return function (_req: Request, res: Response, _next: NextFunction) {

        const fela_renderer = createRenderer({
            devMode: !is_production
        });
        fela_renderer.renderStatic(normalize_css + ' ' + core_css);

        const content = ReactDOMServer.renderToString(React.createElement(App, { fela_renderer }));

        let response = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="theme-color" content="#1d3c8d">

                ${renderToMarkup(fela_renderer)}
            </head>
            <body>
                <div class="main_root" id="root">${content}</div>
                ${printWebpackScriptAssets(res)}
            </body>
            </html>       
        `;

        res.status(200).send(minify(response, {
            collapseWhitespace: true,
            minifyJS: false,
            minifyCSS: {
                /* try to disable any optimizations: FELA is not going to re-hydrate them correctly if anything has changed */
                compatibility: {
                    properties: {
                        colors: false,
                        merging: false
                    }
                }
            }
        }));
    }
}